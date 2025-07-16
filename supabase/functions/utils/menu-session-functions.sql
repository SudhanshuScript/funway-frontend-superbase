
-- Function to check if a table exists
CREATE OR REPLACE FUNCTION check_table_exists(table_name TEXT)
RETURNS BOOLEAN 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = $1
  );
END;
$$;

-- Function to check if a menu-session mapping exists
CREATE OR REPLACE FUNCTION check_menu_session_mapping(menu_id_param UUID, session_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.menu_session_map
    WHERE menu_id = menu_id_param
    AND session_id = session_id_param
  );
END;
$$;

-- Function to fetch all menu session mappings
CREATE OR REPLACE FUNCTION fetch_menu_session_mappings()
RETURNS SETOF public.menu_session_map
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY SELECT * FROM public.menu_session_map;
END;
$$;

-- Function to get menu mappings by session
CREATE OR REPLACE FUNCTION get_menu_mappings_by_session(session_id_param UUID)
RETURNS SETOF public.menu_session_map
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY 
  SELECT * FROM public.menu_session_map
  WHERE session_id = session_id_param;
END;
$$;

-- Function to get menu mappings by menu item
CREATE OR REPLACE FUNCTION get_menu_mappings_by_menu(menu_id_param UUID)
RETURNS SETOF public.menu_session_map
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY 
  SELECT * FROM public.menu_session_map
  WHERE menu_id = menu_id_param;
END;
$$;

-- Function to get menu items by session
CREATE OR REPLACE FUNCTION get_menu_items_by_session(session_id_param UUID)
RETURNS TABLE (
  session_id UUID,
  menu_item public.menu_items
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY 
  SELECT msm.session_id, mi.*
  FROM public.menu_session_map msm
  JOIN public.menu_items mi ON msm.menu_id = mi.id
  WHERE msm.session_id = session_id_param;
END;
$$;

-- Function to get sessions by menu item
CREATE OR REPLACE FUNCTION get_sessions_by_menu_item(menu_id_param UUID)
RETURNS SETOF public.sessions
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY 
  SELECT s.*
  FROM public.menu_session_map msm
  JOIN public.sessions s ON msm.session_id = s.id
  WHERE msm.menu_id = menu_id_param;
END;
$$;

-- Function to get all menu items with their sessions
CREATE OR REPLACE FUNCTION get_all_menu_session_items()
RETURNS TABLE (
  session_id UUID,
  menu_item public.menu_items
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY 
  SELECT msm.session_id, mi.*
  FROM public.menu_session_map msm
  JOIN public.menu_items mi ON msm.menu_id = mi.id;
END;
$$;

-- Function to create a menu-session mapping
CREATE OR REPLACE FUNCTION create_menu_session_mapping(menu_id_param UUID, session_id_param UUID)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_id UUID;
BEGIN
  -- Check if mapping already exists
  IF EXISTS (
    SELECT 1 FROM public.menu_session_map
    WHERE menu_id = menu_id_param AND session_id = session_id_param
  ) THEN
    -- Return the ID of the existing mapping
    SELECT id INTO new_id FROM public.menu_session_map 
    WHERE menu_id = menu_id_param AND session_id = session_id_param;
    
    RETURN new_id;
  END IF;
  
  -- Create new mapping
  INSERT INTO public.menu_session_map (menu_id, session_id)
  VALUES (menu_id_param, session_id_param)
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Function to delete a menu-session mapping
CREATE OR REPLACE FUNCTION delete_menu_session_mapping(menu_id_param UUID, session_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.menu_session_map
  WHERE menu_id = menu_id_param
  AND session_id = session_id_param;
  
  -- Check if deletion was successful
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;
