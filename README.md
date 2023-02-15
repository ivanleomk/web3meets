# Introduction

## Running Application

1. Installing Packages

```bash
yarn install
```

2. Link the supabase instance to the current repo

```bash
ivanleo@Ivans-MacBook-Pro web3meets % supabase login
You can generate an access token from https://app.supabase.com/account/tokens
Enter your access token: ...
Finished supabase login.
ivanleo@Ivans-MacBook-Pro web3meets % supabase link --project-ref <project ref> --password <db password>
Finished supabase link.
```

3. Make sure you are using latest types by pulling from db

```bash
ivanleo@Ivans-MacBook-Pro web3meets % make update-types
supabase gen types typescript --linked > src/types/database-raw.ts
```

4. Run app

```bash
yarn run dev
```

# Useful Resources

- [How we use our types](https://www.ziadmtl.dev/blog/using-supabase-with-typescript)
