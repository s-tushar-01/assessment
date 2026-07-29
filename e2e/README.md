# Optional browser tests

`smoke.py` is the basic browser smoke test used for assessment evidence.

`optional_flows.py` exercises the broader user flow:

- account creation and login;
- authenticated vehicle creation;
- make and minimum-price search;
- purchasing a vehicle and verifying stock reduction;
- a purchase-flow screenshot.

The admin controls are intentionally optional because the normal registration
endpoint creates `USER` accounts. To exercise an existing seeded admin account,
provide `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD` before extending the admin
section of the script.

Run locally with both servers available:

```powershell
python e2e/optional_flows.py
```
