# Contributing to Substrate Contracts UI

👍🎉 &nbsp; First off, thanks for taking the time to contribute! &nbsp; 🎉👍

When contributing to this repository, please check our open issues and if there is already an issue related to your idea. Please first discuss the change you wish to make via creating a Github issue and wait for a reply from the maintainers of this repository before making a change.

We have a code of conduct, please follow it in all your interactions with the project.

## Pull requests

We use a pull request flow, no direct pushes to main branch.

**For a pull request to be merged it must at least:**

:white_check_mark: &nbsp; Pass CI

:white_check_mark: &nbsp; Contain only GPG signed commits - if you are a Parity employee, follow the [yubikey gpg setup guide](https://www.notion.so/paritytechnologies/Yubikey-Guide-787b2f4e340a40369bbf3159fa3643de)

:white_check_mark: &nbsp; Have one approving review

**Ideally, a good pull request should:**

:clock3: &nbsp; Take less than 15 minutes to review

:open_book: &nbsp; Have a meaningful description (describes the problem being solved) and commit messages that clarify intent

:one: &nbsp; Introduce one feature or solve one bug at a time, for which an open issue already exists. In case of a project wide refactoring, a larger PR is to be expected, but the reviewer should be more carefully guided through it.

:jigsaw: &nbsp; Issues that seem too big for a PR that can be reviewed in 15 minutes or PRs that need to touch other issues should be discussed and probably split differently before starting any development

:dart: &nbsp; Handle renaming, moving files, linting and formatting separately (not alongside features or bug fixes)

:test_tube: Add tests for new functionality

**Draft pull requests for early feedback are welcome and do not need to adhere to any guidelines.**

When reviewing a pull request, the end-goal is to suggest useful changes to the author. Reviews should finish with approval unless there are issues that would result in:

:x: &nbsp; Buggy behavior.

:x: &nbsp; Undue maintenance burden.

:x: &nbsp; Measurable performance issues

:x: &nbsp; Feature reduction (i.e. it removes some aspect of functionality that a significant minority of users rely on).

:x: &nbsp; Uselessness (i.e. it does not strictly add a feature or fix a known issue).

:x: &nbsp; Disabling a compiler feature to introduce code that wouldn't compile

## Code style

We use ESLint Webpack Plugin to enforce linting rules at build time, and although our configuration is a guide for a good practices in 99% of cases, there are exceptions where the linter needs to be turned off. In such cases we encourage using `// eslint-disable-next-line` preceded by a short explanation to why that rule was disabled. If the same rule needs to be disabled too many times in a file and the code becomes cluttered with comments, then disabling the rule for the entire file makes more sense.

To run a project wide format you can use :

```bash
yarn lint
```

We use Prettier as code formatter for things like spacing and quotes. We encourage adding a Prettier extension to your IDE, if possible.
Developing in your preferred style should be possible as well, staged code is formatted via a pre-commit hook.

To run a project wide format you can use:

```bash
yarn format
```
