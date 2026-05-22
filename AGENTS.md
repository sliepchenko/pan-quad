# Agent Workflow Instructions

## Mandatory Protocol for Every Task

Before starting any task, read these files in order:

1. `KNOWLEDGE.md` — AI knowledge storage: project architecture, servo mappings, states, known issues, and all technical decisions.
2. `ROADMAP.md` — current feature status and planned work.

After completing the task, update the following files:

### KNOWLEDGE.md
This is the AI's own knowledge storage (also readable by humans). Keep it up to date with:
- Project description and purpose
- Hardware configuration (servo IDs, leg assignments, pin mappings)
- All robot states and their servo angle tables
- Technical decisions and their rationale
- Known problems and limitations
- Anything useful for future development sessions
- All information must be well-structured

### ROADMAP.md
Only mark items as done if they were completed in the current task. Do **not** add new items or reorganize unless explicitly asked.

## Boundaries

The agent must **never** access, read, write, or execute anything outside of the repository root (`/Users/Mykola_Sliepchenko/WebstormProjects/pan-quad`). All file operations, searches, and commands must remain strictly within the repo.

## Commit and Push Strategy

When the user sends the command `push`, execute the following steps in order:

1. `git add .` — stage all changed and untracked files
2. `git commit -m "<message>"` — commit with a single-line message that is a short description of the feature or change implemented (no bullet points, no multi-line body)
3. `git push` — push to the remote repository

### Commit message rules
- One line only
- Must start with `[ADD]` for new features/additions or `[FIX]` for bug fixes (e.g. `[ADD] walk gait`, `[FIX] servo angle offset`)
- A commit may combine both prefixes if it both adds and fixes (e.g. `[ADD][FIX] refactor stand state with angle fix`)
- Written in imperative mood after the prefix
- Describes **what was implemented or changed**, not the mechanical steps taken
- Keep it under 72 characters

## Code Style Rules

- All code is MakeCode JavaScript targeting the BBC micro:bit V2.
- Use the `robotbit` extension API for servo control (`robotbit.Servo(robotbit.Servos.Sx, angle)`).
- Use the `neopixel` extension API for RGB LED control (`robotbit.rgb().showColor(neopixel.hsl(h, s, l))`).
- Group servo calls by state function (e.g. `useStateStand`, `useStateTransportation`).
- All state transition functions must be named `useState<StateName>()`.
- Button A → primary state (stand/idle).
- Button B → secondary state (transportation/locomotion).
- Button A+B → reserved for future use.
- `basic.forever()` loop is reserved for continuous sensor polling or animation logic.
