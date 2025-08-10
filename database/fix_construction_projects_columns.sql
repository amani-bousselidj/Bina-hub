-- This script checks the columns of the 'construction_projects' table and adds any missing columns needed by the frontend.
-- Adjust types as needed for your use case.

DO $$
BEGIN
    -- Add user_id if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='construction_projects' AND column_name='user_id'
    ) THEN
        ALTER TABLE construction_projects ADD COLUMN user_id uuid;
    END IF;

    -- Add project_name if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='construction_projects' AND column_name='project_name'
    ) THEN
        ALTER TABLE construction_projects ADD COLUMN project_name text;
    END IF;

    -- Add status if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='construction_projects' AND column_name='status'
    ) THEN
        ALTER TABLE construction_projects ADD COLUMN status text;
    END IF;

    -- Add location if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='construction_projects' AND column_name='location'
    ) THEN
        ALTER TABLE construction_projects ADD COLUMN location text;
    END IF;

    -- Add estimated_cost if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='construction_projects' AND column_name='estimated_cost'
    ) THEN
        ALTER TABLE construction_projects ADD COLUMN estimated_cost numeric;
    END IF;

    -- Add spent_cost if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='construction_projects' AND column_name='spent_cost'
    ) THEN
        ALTER TABLE construction_projects ADD COLUMN spent_cost numeric DEFAULT 0;
    END IF;

    -- Add created_at if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='construction_projects' AND column_name='created_at'
    ) THEN
        ALTER TABLE construction_projects ADD COLUMN created_at timestamptz DEFAULT now();
    END IF;

    -- Add updated_at if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='construction_projects' AND column_name='updated_at'
    ) THEN
        ALTER TABLE construction_projects ADD COLUMN updated_at timestamptz DEFAULT now();
    END IF;
END $$;

-- You can run this script in your Supabase SQL editor or psql to ensure all required columns exist.
