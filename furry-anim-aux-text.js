/**
 * ZENNITH'S FURRY ANIMATION LIBRARY (VERSION 2023-09)
 * This HTML and associated Javascript application was written by Zennith. Copyright 2020,2023.
 * It is covered by a GPL-3.0-or-later license. Please note disclaimers of liability in the 
 * GPL-3.0-or-later license apply in full force if you use this program.
 */
 
 

/**
 * Use this file to put lenthier text. You can define any arbitrary
 * function names (assuming they're valid JavaScript) without worrying about breaking things. 
 * You would then invoke these functions to, for example, add text to the splash screen
 * and/or the popup menu.
 *
 * To add text to the splash screen, you would invoke:
 * splashScreen.splash_screen_cascade(array_of_string_objects, array_of_fade_in_delays)
 * (you would call this from the main .HTM file).
 * 
 * To add text to a tab in the popup menu, you would use:
 * popup_menu_instance.add_tab('Title of tab', new MenuTabPane(string_object));
 * (you would also call this from the main .HTM file).
 */



const text_popup_menu_other_sites = ""
	+ "<div style='left:0%;'><p><b>My personal site:</b></p>"
	+ "<a href='https://zennith.net' target='blank'>zennith.net.</a> "
	+ "Has animations like this one, and raw blender files available for download. No login required."

	+ "</div>"
;



const text_popup_menu_license_html = ""
	+ "<p><b>This interactive animation, as composited and fixed in its final form, is Copyright YYYY "
	+ "by THE ARTIST. All rights, not elsewhere limited, are reserved.</b></p> "

	+ "</p><br><p><b>Sound effects:</b></p><p>"
	+ "<ul><li>"
	+ "The Crickets At Night sound effect is credited to Mike Koenig, and was obtained from "
	+ "<a href='http://soundbible.com/365-crickets-at-night.html' target='blank'>soundbible.com</a> "
	+ "under an <a href='https://creativecommons.org/licenses/by/3.0/us/#' target='blank'> Attribution 3.0 license</a>. "
	+ "The sound effect was modified by Zennith's player to make it suitable for looping without being noticable by the listener. "
	+ "</li></ul>"

	+ "</p><br><p><b>This video playing software:</b></p><p>"
	+ "<ul><li>"
	+ "Zennith's Furry Animation Library (Version 2023-09), including HTML and JavaScript coding, "
	+ "was written by Zennith. Copyright 2020, 2023. It is covered by a GPL-3.0-or-later license. Please note disclaimers "
	+ "of liability in the GPL-3.0-or-later license apply in full force if you use this program."
	+ "</li></ul>"

	+ "</p><br><p><b>Disclaimers:</b></p><p>"
	+ "Any other disclaimers you need. For example, 'All characters in this artwork are ficticious, and any similarities to any "
	+ "other characters or personalities not shown in this artwork are coincidental.'"

	+ "</p><br>"
;




const content_warning = ""
	+ "<p>The following EXAMPLE content is SAFE TO VIEW BY ALL AUDIENCES."
	+ "<br>Do not view it if... you don't feel like it I guess? :P</p>"
;


const cascade_intro_text_A = ""
	+ "<p>A cube spins..."
	+ " and spins and spins...</p>"
;

const cascade_intro_text_B = ""
	+ "<p>What is it going to do next? </p>"
;

const cascade_intro_text_C = ""
	+ "<p>Bounce? Jolt? Hustle? Jiggle? Undulate? " 
	+ "Make hypnotic motions of some sort? </p>"
;

const cascade_intro_text_D = ""
	+ "<p>Nope! Going to keep spinning.~ "
	+ "<br><br>Note that this video currently has a blurry black framing, that you can use "
	+ "to mimic a Point-Of-View effect for the user. Simply edit the HTML file "
	+ "to use a different image or disable it. Easy! </p>"
;


const text_popup_intro_text = ""
	+ cascade_intro_text_A 
	+ cascade_intro_text_B 
	+ cascade_intro_text_C 
	+ cascade_intro_text_D
;
