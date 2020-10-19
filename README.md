# G.I.N.G.E.R.
G.I.N.G.E.R. == Give Instruction Next Gain Exciting Result<br/>
G.I.N.G.E.R. is a polymorphic Node.js IoT framework, it's intended as both a rapid prototyping framework as well as a framework that can be used in automation contexts.
It enables developers to quickly write server-side IoT code and deploy it on a Node.js server.

## Installing and Running
G.I.N.G.E.R. is a simple Node.js project so node is needed to use it.
Also ```npm install``` should be executed in order to remain up to date with dependencies.

## Layout
G.I.N.G.E.R. has a somewhat unusual directory layout due to its original concept being inspired by an actual dog named Ginger.

### Attention
Attention files are used to describe the behavior of the server-side system.
Using Ginger, developers can create various components that can be wired together.
For example, they can describe the protocol they need and their desired application platform without worrying about the semantics of how these will be implemented.
There are always some example attention files available.

### Core
The core directory contains the main G.I.N.G.E.R. object that enables the rest of the framework. This object will perform bookkeeping duties and other maintenance functionality.

### Obstacles
Obstacles are various components which can be used to expand the behavior of other components. Think of it as if you're telling Ginger to perform trick but before she can do that, she still has to hop over a few hurdles and run through a tunnel on a dog agility course.

#### Hurdle
A hurdle is an abstraction of authentication-like protocols.
A hurdle allows the developer to simply specify what kind of authentication they need without having to implement the actual protocol.
It will simply plug into whatever G.I.N.G.E.R. component is being used.

#### Tunnel
A tunnel is a way to pass information from one place to another.
They are abstractions of communication-like protocols.
There are input tunnels which allow developer to specify what to do with a given input, or to be plugged into another G.I.N.G.E.R. component.
Output tunnels allow for messages to be sent to another system.

#### Seesaw
A seesaw is an abstraction of timer events. They allow for easily scheduling recurring events.

### Tricks
Tricks are the main pull factor of G.I.N.G.E.R. a trick typically takes other G.I.N.G.E.R. components as input, and then lets the system perform a sort of "trick".
These can be something like using input to turn a TV on and off.

## Workflows

### Publishing
1. Make Version on GitHub
2. Publish directly to NPM
3. Publish to GitHub
