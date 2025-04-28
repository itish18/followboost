type Client = {
    id: string;
    user_id: string;
    full_name: string;
    email: string;
    company?: string | null;
    phone?: string | null;
    notes?: string | null;
    created_at: string;
  };