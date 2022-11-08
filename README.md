# CS 484 Final Project: BikeSpy
## Team Name
**Twix** (Github Repo: https://github.com/ckclassrooms/final-project-proposal-twix.git)
App deployment: https://cool-conkies-80a0da.netlify.app/
## Team Members:
| Name                            | Net ID   |
| ------------------------------- | -------- |
| Nitish Dewan                    | ndewan2  |
| Jeet Paresh Mehta               | jmehta27 |
| Monisha Siddananda Sampath      | msidda2  |
| Sharath Bhargav                 | sbharg9  |

## Objectives: 
1. Users should be able to login via Email or an SSO.
2. Once logged in, users should be able to submit a violation with required details using the form provided (including location).
3. Users will be able to visualize all the violations submitted for an area and filter data as needed.
4. Users can also visualize the violations on a map.

## Project Summary:
The project involves a web application that allows users to report and submit the details of any Bike Lane violation. Violations mainly consist of a vehicle parked in the bike lane. The application also allows the user to submit images along with other details of violation. This data is stored in a database and can be accessed by any registered user using the interface provided. 

In addition to the live database view, the data can also be visualized in an interactive map. 

We envision the following security and privacy concerns when managing the user data for our application:
- The location acquired from the device should be securely read and stored.
- The authentication methods, SSO or User Sign-up, should be implemented securely.
- All confidential data should be stored in hashed form, and not as plain-text.

For the implementation, the following tech stack is being considered:

| Tech Stack   | Description |
| -----------  | ----------- |
| Languages    | JavaScript  |
| Frameworks   | React       |
| Services     | Supabase    |
| Database     | PostgreSQL, PostGIS|