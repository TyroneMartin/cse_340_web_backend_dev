# PostgreSQL Setup with Render and pgAdmin

This is a quick guide to help you connect and setup your Render PostgreSQL database to pgAdmin for local development and table management.

---

## 🚀 1. Create a PostgreSQL Database on Render

1. Go to [https://render.com](https://render.com)
2. Click **New → PostgreSQL**
3. Enter a unique database name (e.g. `car_inventory_system`)
4. Wait 1–10 minutes for provisioning
5. Go to the **Info** tab to get your credentials:
   - Hostname
   - Database
   - Username
   - Password
   - External Database URL (copy this!)

---

## 🧭 2. Parse the External Database URL

Your External URL will look like this:

```
postgresql://username:password@host:port/database
```

Example from Render:

```
postgresql://car_inventory_system_user:PTnbzb8VIhxJZ40wBwFtPdkH4l5ZktNJ@dpg-ruoi9gidbo4c98ryrq44588-a.oregon-postgres.render.com:5432/car_inventory_system
```

Example of pgAdmin Connection:

| Field               | Value                                                              |
|---------------------|---------------------------------------------------------------------|
| Host name/address   | `dpg-ruoi9gidbo4c98ryrq44588-a.oregon-postgres.render.com` 👈 **cut here** |
| Port                | `5432`                                                              |
| Database            | `car_inventory_system`                                     |
| Username            | `car_inventory_system_user`                                |
| Password            | `PTnbzb8VIhxJZ40wBwFtPdkH4l5ZktNJ`                                   |

---

## 🛠 3. Connect in pgAdmin

1. Open pgAdmin
2. Go to **Create → Server**
3. Under the **Connection** tab, enter the values from above
4. Click **Save**
5. Open the **Query Tool** to run your SQL scripts

---

## 🧾 4. Run Your SQL Scripts

After connecting, execute:

- `creation_of_tables.sql`
- `assignment2.sql`
- `final_project.sql`

These are found in your project's `/database/` folder.

They will:
- Create all necessary tables like `classification`, `inventory`, etc.

### **** Done ****