-- Super Admin Schema for Circle Classroom Platform

-- Schools table
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  admin_name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium', 'enterprise')),
  max_students INTEGER DEFAULT 50,
  max_teachers INTEGER DEFAULT 5,
  billing_email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update profiles table to add school_id and enhanced roles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('super_admin', 'school_admin', 'teacher', 'staff'));

-- System announcements table
CREATE TABLE IF NOT EXISTS system_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'admins', 'teachers', 'schools')),
  active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- API keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  permissions JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  school_id UUID REFERENCES schools(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform metrics table (for analytics)
CREATE TABLE IF NOT EXISTS platform_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  total_schools INTEGER DEFAULT 0,
  active_schools INTEGER DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  total_teachers INTEGER DEFAULT 0,
  total_attendance_records INTEGER DEFAULT 0,
  system_uptime_percentage DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(metric_date)
);

-- School usage statistics
CREATE TABLE IF NOT EXISTS school_usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  stat_date DATE NOT NULL,
  active_students INTEGER DEFAULT 0,
  active_teachers INTEGER DEFAULT 0,
  attendance_records INTEGER DEFAULT 0,
  assignments_created INTEGER DEFAULT 0,
  storage_used_mb INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, stat_date)
);

-- Enable RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_usage_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for schools
CREATE POLICY "Super admins can view all schools"
  ON schools FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage all schools"
  ON schools FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "School admins can view their school"
  ON schools FOR SELECT
  USING (
    id IN (
      SELECT school_id FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'school_admin'
    )
  );

-- RLS Policies for system announcements
CREATE POLICY "Super admins can manage announcements"
  ON system_announcements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "All authenticated users can view active announcements"
  ON system_announcements FOR SELECT
  USING (active = true AND auth.uid() IS NOT NULL);

-- RLS Policies for API keys
CREATE POLICY "Super admins can manage all API keys"
  ON api_keys FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

-- RLS Policies for audit logs
CREATE POLICY "Super admins can view all audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Users can view their own audit logs"
  ON audit_logs FOR SELECT
  USING (user_id = auth.uid());

-- RLS Policies for platform metrics
CREATE POLICY "Super admins can view platform metrics"
  ON platform_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage platform metrics"
  ON platform_metrics FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

-- RLS Policies for school usage stats
CREATE POLICY "Super admins can view all usage stats"
  ON school_usage_stats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "School admins can view their school stats"
  ON school_usage_stats FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'school_admin'
    )
  );

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_audit_id UUID;
  v_school_id UUID;
BEGIN
  -- Get user's school_id
  SELECT school_id INTO v_school_id
  FROM profiles
  WHERE id = auth.uid();

  INSERT INTO audit_logs (
    user_id,
    school_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    auth.uid(),
    v_school_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_details
  ) RETURNING id INTO v_audit_id;

  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update platform metrics
CREATE OR REPLACE FUNCTION update_platform_metrics()
RETURNS void AS $$
DECLARE
  v_metric_date DATE := CURRENT_DATE;
BEGIN
  INSERT INTO platform_metrics (
    metric_date,
    total_schools,
    active_schools,
    total_students,
    total_teachers,
    total_attendance_records
  )
  SELECT
    v_metric_date,
    COUNT(DISTINCT s.id),
    COUNT(DISTINCT CASE WHEN s.status = 'active' THEN s.id END),
    COUNT(DISTINCT st.id),
    COUNT(DISTINCT CASE WHEN p.role IN ('teacher', 'school_admin') THEN p.id END),
    COUNT(a.id)
  FROM schools s
  LEFT JOIN profiles p ON p.school_id = s.id
  LEFT JOIN students st ON st.classroom_id IN (
    SELECT c.id FROM classrooms c WHERE c.teacher_id = p.id
  )
  LEFT JOIN attendance a ON a.date = v_metric_date
  ON CONFLICT (metric_date) DO UPDATE SET
    total_schools = EXCLUDED.total_schools,
    active_schools = EXCLUDED.active_schools,
    total_students = EXCLUDED.total_students,
    total_teachers = EXCLUDED.total_teachers,
    total_attendance_records = EXCLUDED.total_attendance_records;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_schools_status ON schools(status);
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_school_id ON audit_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_metrics_date ON platform_metrics(metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_school_usage_stats_school_date ON school_usage_stats(school_id, stat_date DESC);
