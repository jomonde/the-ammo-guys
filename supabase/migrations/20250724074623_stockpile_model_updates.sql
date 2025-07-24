-- Enable necessary extensions if not already enabled
create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "pgcrypto" with schema extensions;

-- Create enum types
create type trigger_type as enum ('budget', 'quantity', 'manual');
create type change_type as enum ('allocation', 'shipment', 'adjustment');
create type allocation_frequency as enum ('weekly', 'biweekly', 'monthly');

-- Add new columns to virtual_stockpile
alter table public.virtual_stockpile 
  add column if not exists target_quantity integer,
  add column if not exists last_allocation_date timestamptz,
  add column if not exists last_shipment_date timestamptz;

-- Add new columns to subscriptions
alter table public.subscriptions
  add column if not exists next_allocation_date timestamptz,
  add column if not exists allocation_frequency allocation_frequency default 'monthly',
  add column if not exists shipping_preferences jsonb default '{}';

-- Create shipment_triggers table
create table if not exists public.shipment_triggers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  trigger_type trigger_type not null,
  threshold_value decimal(10,2) not null check (threshold_value > 0),
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint unique_user_trigger_type unique (user_id, trigger_type)
);

-- Create stockpile_history table
create table if not exists public.stockpile_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references public.products on delete set null,
  quantity_change decimal(10,2) not null,
  change_type change_type not null,
  reference_id uuid,
  notes text,
  created_at timestamptz default now()
);

-- Create indexes for better performance
create index if not exists idx_shipment_triggers_user_id on public.shipment_triggers(user_id);
create index if not exists idx_stockpile_history_user_id on public.stockpile_history(user_id);
create index if not exists idx_stockpile_history_created_at on public.stockpile_history(created_at);

-- Enable RLS on new tables
alter table public.shipment_triggers enable row level security;
alter table public.stockpile_history enable row level security;

-- Create RLS policies for shipment_triggers
create policy "Users can view their own shipment triggers"
on public.shipment_triggers for select
using (auth.uid() = user_id);

create policy "Users can manage their own shipment triggers"
on public.shipment_triggers for all
using (auth.uid() = user_id);

-- Create RLS policies for stockpile_history
create policy "Users can view their stockpile history"
on public.stockpile_history for select
using (auth.uid() = user_id);

-- Create function to update updated_at columns
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_shipment_triggers_updated_at
before update on public.shipment_triggers
for each row execute function update_updated_at_column();

-- Create function to log stockpile changes
create or replace function log_stockpile_change()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    insert into public.stockpile_history (
      user_id, 
      product_id, 
      quantity_change, 
      change_type, 
      reference_id,
      notes
    ) values (
      new.user_id,
      new.product_id,
      new.quantity_allocated,
      'allocation',
      new.id,
      'Initial allocation'
    );
  elsif tg_op = 'UPDATE' then
    if new.quantity_allocated != old.quantity_allocated then
      insert into public.stockpile_history (
        user_id, 
        product_id, 
        quantity_change, 
        change_type, 
        reference_id,
        notes
      ) values (
        new.user_id,
        new.product_id,
        new.quantity_allocated - old.quantity_allocated,
        'adjustment',
        new.id,
        'Quantity adjustment'
      );
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for stockpile changes
create trigger handle_virtual_stockpile_changes
after insert or update on public.virtual_stockpile
for each row execute function log_stockpile_change();

-- Create function to handle shipment creation
create or replace function create_shipment()
returns trigger as $$
begin
  -- Update last_shipment_date for all affected products
  update public.virtual_stockpile
  set last_shipment_date = now()
  where user_id = new.user_id
  and product_id in (select product_id from public.shipment_items where shipment_id = new.id);
  
  -- Log the shipment in stockpile_history
  insert into public.stockpile_history (
    user_id,
    product_id,
    quantity_change,
    change_type,
    reference_id,
    notes
  )
  select 
    new.user_id,
    si.product_id,
    -si.quantity, -- Negative because it's a reduction in stockpile
    'shipment',
    new.id,
    'Shipped in shipment ' || new.id::text
  from public.shipment_items si
  where si.shipment_id = new.id;
  
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for shipment creation
create trigger handle_shipment_creation
after insert on public.shipments
for each row execute function create_shipment();