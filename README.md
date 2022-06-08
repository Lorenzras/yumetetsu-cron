# Yumecoco CronJobs

[日本語版](README.ja.md)

- [Yumecoco CronJobs](#yumecoco-cronjobs)
  - [Usage](#usage)
  - [Settings](#settings)
  - [Jobs](#jobs)
  - [Testing](#testing)
  - [Paths](#paths)
  - [Definition of Terms](#definition-of-terms)


This project is a monorepo of automation
for Yumetetsu and Cocosumo written in Typescript.

## Usage

1. Run the following commands on the root folder.

   ```bash
   git fetch
   npm run build
   ```

2. Execute **start.bat** at the root folder.

3. Done. Jobs will now be automatically executed according to

## Settings

- [Cron Jobs](src/main.ts)
Configure task schedule here.
Refer to [Cron Generator](https://crontab.guru/)

## Jobs

- [Portal Check](src/tasks/syncs/portalCheck/readme.md)
- [Sync Donetwork Customer to Kintone](src/tasks/syncs/doNet/syncDoNetCust.ts)
- [Sync Donetwork Properties to Kintone](src/tasks/syncs/doNet/syncDonetProperties.ts)
  (inactive)

- [Sync Reins to Kintone](src/tasks/syncs/reins/syncProperties.ts)
(inactive)



## Testing

This project use [jest](https://jestjs.io/).

Files with accompanying *.test.ts may be tested.

```bash
jest [relative file path] -t [testName]
```

Example to test run portalCheck run the following:

```bash
jest portalCheckMainTask -t main
```

There maybe conditions before running the test,
please check the code or contact the programmer.

Refer to [jest](https://jestjs.io/) for more information.

## Paths

- Logs
   Located at the root's **logs** folder.

- Downloads
   Located at the root's **downloads** folder.

- [Other Paths](./src/utils/paths.ts).

## Definition of Terms

- **Root**
The project's base folder.

- **Cron**
A Linux command used for scheduling tasks to be executed sometime in the future.
This is normally used to schedule a job that is executed periodically.

- **Job**
Refers to tasks run by cron.

- **Typescript**
A superset of Javascript used as the programming language for this project.
Used officially by large companies like Google.
