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

type Followup={
  id:string;
  user_id:string;
  client_id:string;
  subject:string;
  body:string;
  status:string;
  is_opened:boolean;
  scheduled_at :string|null;
  sent_at :string;
  created_at :string;
  clients:Client;
}  