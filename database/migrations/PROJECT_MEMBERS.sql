-- Simple project members table for permissions
CREATE TABLE IF NOT EXISTS project_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member', -- owner | supervisor | member
  invited_by uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Basic RLS: users can see rows for projects they belong to
CREATE POLICY IF NOT EXISTS "project_members_select" ON project_members
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "project_members_insert" ON project_members
FOR INSERT WITH CHECK (auth.uid() = invited_by OR auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "project_members_delete" ON project_members
FOR DELETE USING (auth.uid() = invited_by OR auth.uid() = user_id);
