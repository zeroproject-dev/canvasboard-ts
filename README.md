# CanvasBoard

Simple board for draw in a browser :).

<p align="center" >
  <img src="https://github.com/zeroproject-0/canvasboard-ts/blob/main/docs/images/screenshot.png" alt="board" />
</p>

## Index

- [Installation](#installation)
  - [Docker Compose](#docker-compose)
- [Usage](#usage)
  - [With Link](#with-link)
  - [Shortcuts](#shortcuts)
    - [PC](#pc)
    - [Cellphone](#cellphone)
  - [Tool Bar](#tool-bar)

## Installation

If you want to install this on your own network, just need to build and run the Dockerfile with the docker compose file.

### Docker compose

Inside the cloned repository, run the following command.

```bash
sudo docker compose -f docker-compose.build.yml up --force-recreate --build --remove-orphans
```

And then go to the following link: [http://localhost:8080](http://localhost:8080)

## Usage

### With Link

If you want to use the board, just go to the following link [Board](https://projects.zeroproject.dev/canvasboard-ts)

### Shortcuts

#### PC

| key         | Description |
| ----------- | ----------- |
| Ctrl + z    | undo        |
| Wheel       | Zoom In/Out |
| Wheel press | Drag        |
| Mouse Left  | Draw        |

#### Cellphone

| Touch     | Description |
| --------- | ----------- |
| One Touch | Draw        |
| Two Touch | Zoom In/Out |
| Two Touch | Drag        |

### Tool bar

<p align="center" >
  <img src="https://github.com/zeroproject-0/canvasboard-ts/blob/main/docs/images/config.png" alt="tools" />
</p>

| Tool            | Description                                                                            |
| --------------- | -------------------------------------------------------------------------------------- |
| pen             | Free drawing, but if you hold still for half a second, it becomes a line.              |
| rectangle       | It draws rectangles, but if you hold it still for half a second, it becomes a square.  |
| circle          | It draws ellipses, but if you hold it still for half a second, it convert to a circle. |
| eraser          | You just click or touch over the shape and it will be erased.                          |
| fill            | If checked, the rectangles and circles you draw will be filled in.                     |
| the second fill | It's for the fill color.                                                               |
| lines           | It's for the color of the lines.                                                       |
| canvas          | It's the background color.                                                             |
| the range       | It's for the line width.                                                               |
| clear           | Clear the board.                                                                       |
| reset           | Reset to default configuration (zoom, colors, etc).                                    |
| the arrow       | Undo.                                                                                  |
| download        | Saves in an image what you can see on the board.                                       |
