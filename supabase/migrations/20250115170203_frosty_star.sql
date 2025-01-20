/*
  # Création de l'utilisateur initial et son profil

  1. Création de l'utilisateur
    - Email: it@fekhar-lawfirm.com
    - Mot de passe: fekhar
  2. Création du profil associé
*/

-- Création de l'utilisateur avec auth.users
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Vérifier si l'utilisateur existe déjà
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'it@fekhar-lawfirm.com'
  ) THEN
    -- Insérer le nouvel utilisateur
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'it@fekhar-lawfirm.com',
      crypt('fekhar', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Fekhar Law Firm"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO new_user_id;

    -- Créer le profil associé
    INSERT INTO public.profiles (
      id,
      email,
      created_at,
      updated_at
    ) VALUES (
      new_user_id,
      'it@fekhar-lawfirm.com',
      now(),
      now()
    );
  END IF;
END $$;