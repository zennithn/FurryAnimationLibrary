# FurryAnimationLibrary

Plays interactive looping animations in the browser.


## What this code does

This JavaScript code lets you create an interactive, looping animation, starting from a plain video file. The code runs in a web browser.

When initially opening an animation you have produced, the user may first, optionally, be presented with a splash screen. This splash screen might tell a background story, and you can use it to collect the user's consent before proceeding to view the animation.

Once viewing the animation itself, the animation occupies most or all of the viewport. The user may advance to the next animation loop by pressing an arrow-shaped button. Next to this button, there is space to display text according to the timeline, so that text can progress according to the place in the animation. When transitioning from one loop to the next, the video will play through any transitional sequences for a smooth an immersive experience. 

Additionally, the user can make the animation fullscreen, can mute or unmute the audio, and can click a 'hamburger' icon to open up a larger popup menu with more information (e.g. a more detailed backstory, links to an artist's other websites, license and copyright information, etc).


## Example

You can view an example of the sort of animation that you can create with this code by going to EXAMPLE TBD.


## Using this code

To use this code, you should download all files from this GitHub repository, edit code where appropriate (e.g. defining frame numbers, adding text, customizing, etc), and add your own content files. 

All materials should then be uploaded to a web server where you can access that server's filesystem. This means that you probably cannot upload these files directly using, for example, a WordPress uploader. 


## What you need to provide

Minimally, you need to provide:

- An mp4 or other video file
- The video file's frames-per-second
- Frame numbers for loops


Additionally, it is recommended to provide:

- Frame numbers and narrative text (text that updates at the bottom of the animation's viewport according to frame numbers).
- An audio file for smooth background sound, with the first several seconds increasing in volume from 0% to 100%, and last several seconds decreasing in volume from 100% to 0%. 
- Various 'tabs' of content for the 'hamburger'/popup menu.
- Backstory and/or consent content for the splash screen, if desired.
- An image overlay for the video, if desired (for example, to add a border, or to create an effect for the user to be looking through someone's eyes).


## Known issues

Doesn't work in Safari yet unfortunately.
