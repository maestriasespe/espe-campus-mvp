-- ESPE Campus MVP (Supabase / Postgres)
-- Run this in Supabase SQL editor.

create extension if not exists "uuid-ossp";

-- Students
create table if not exists students (
  id uuid primary key default uuid_generate_v4(),
  matricula text unique not null,
  full_name text not null,
  group_name text,
  created_at timestamptz not null default now()
);

-- Users (custom auth by matrícula)
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  matricula text unique not null,
  role text not null check (role in ('student','admin')),
  password_hash text not null,
  student_id uuid references students(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Modules
create table if not exists modules (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

-- Grades
create table if not exists grades (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references students(id) on delete cascade,
  module_id uuid not null references modules(id) on delete cascade,
  assessment text not null default 'Final',
  grade numeric(5,2) not null,
  graded_at timestamptz default now(),
  created_at timestamptz not null default now()
);

-- Assignments (MVP: global active list; phase 2: per module/group + submissions)
create table if not exists assignments (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null default '',
  due_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Payments
create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references students(id) on delete cascade,
  concept text not null default 'Mensualidad',
  amount numeric(10,2) not null,
  due_date date not null,
  status text not null default 'pending' check (status in ('pending','paid','overdue')),
  proof_url text,
  created_at timestamptz not null default now()
);

-- Views for convenience
create or replace view grades_view as
select g.id, g.student_id, m.name as module_name, g.assessment, g.grade, g.graded_at
from grades g
join modules m on m.id = g.module_id;

create or replace view grades_admin_view as
select g.id, s.matricula, s.full_name as student_name, m.name as module_name, g.assessment, g.grade, g.graded_at
from grades g
join students s on s.id = g.student_id
join modules m on m.id = g.module_id;

create or replace view payments_admin_view as
select p.id, s.matricula, s.full_name as student_name, p.concept, p.amount, p.due_date, p.status
from payments p
join students s on s.id = p.student_id;

-- Create one admin user manually (example):
-- insert into users (matricula, role, password_hash) values ('ADMIN', 'admin', '<bcrypt-hash>');
