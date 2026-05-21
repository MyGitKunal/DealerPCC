# Schema + API Matrix (Generated)

This project already contains most Postgres tables and Express CRUD routes for the main modules. The main missing piece (relative to the current UI) was the **API Registration** page’s “Dealer Conference Registration” payload, which is now modeled in Postgres and exposed via REST.

## Module tables (PostgreSQL)

- **Dealer PCC**
  - Table: `dealer_pcc` (stores module payload in `criteria_data` JSONB)
- **API Registration (single employee/event)**
  - Table: `api_registrations`
- **API Registration (dealer conference registration UI)**
  - Table: `api_conference_registrations` (stores the full UI form as `registration_data` JSONB)
- **MT Meet**
  - Table: `mt_meet_registrations`
- **Surveys**
  - Tables: `workshop_surveys`, `warranty_surveys`, `technical_surveys`
- **Dealer access request approvals**
  - Tables: `dealer_access_requests`, `dealer_access_autofill`

## REST endpoints (Express)

- **Dealer PCC**: `/api/v1/dealer-pcc`
  - `GET /` list (dealer-scoped)
  - `POST /` create (expects `{ applicationDate, criteriaData }`)
  - `GET /dashboard/stats`

- **API Registration (single employee/event)**: `/api/v1/api-registration`
  - `GET /` list
  - `POST /` create (expects `{ employeeName, eventName, ... }`)
  - `GET /dashboard/stats`

- **API Registration (dealer conference registration UI)**: `/api/v1/api-registration/dealer-conference`
  - `GET /dealer-conference` list
  - `POST /dealer-conference` create (expects `{ data: <DealerConferenceRegistrationFormValues> }`)

- **MT Meet**: `/api/v1/mt-meet`
  - `GET /` list
  - `POST /` create
  - `GET /dashboard/stats`

- **Surveys**: `/api/v1/surveys`
  - `GET /workshop` / `POST /workshop`
  - `GET /warranty` / `POST /warranty`
  - `GET /technical` / `POST /technical`

## Example SQL queries

- Latest dealer conference registrations for a dealer:

```sql
SELECT
  registration_number,
  dealer_kvps,
  dealer_name,
  dealer_city,
  participant_count,
  status,
  created_at
FROM api_conference_registrations
WHERE dealer_id = $1
ORDER BY created_at DESC
LIMIT 50;
```

- Count registrations by status:

```sql
SELECT status, COUNT(*)
FROM api_conference_registrations
GROUP BY status
ORDER BY status;
```
