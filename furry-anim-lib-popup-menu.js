/**
 * ZENNITH'S FURRY ANIMATION LIBRARY (VERSION 2023-09)
 * This HTML and associated Javascript application was written by Zennith. Copyright 2020,2023.
 * It is covered by a GPL-3.0-or-later license. Please note disclaimers of liability in the 
 * GPL-3.0-or-later license apply in full force if you use this program.
 */
 
 

class PopupMenuDisplayArea {
	constructor() {
		const newScopeThis = this;

		this.tab_pane_list = new Array();
		this.button_list = new Array();

		this.INDEX_SELECTED = 0;

		this.popup_menu = document.createElement("div");
		this.popup_menu.id = "popup_menu";

		this.popup_menu_transparent_background = document.createElement("div");
		this.popup_menu_transparent_background.id = "popup_menu_transparent_background";
		this.popup_menu.appendChild(this.popup_menu_transparent_background);


		this.menu_display_area = document.createElement("div");
		this.menu_display_area.className = "no_user_select";
		this.menu_display_area.id = "popup_menu_focused_screen";
		this.popup_menu.appendChild(this.menu_display_area);


		this.menu_exit_button = document.createElement("div");
		this.menu_exit_button.className = "no_user_select";
		this.menu_exit_button.id = "menu_exit_button";
		this.menu_exit_button.style.backgroundImage = SYMBOL_EXIT_BUTTON_BUTTON;
		this.popup_menu.appendChild(this.menu_exit_button);
		this.menu_exit_button.onclick = function () {
			newScopeThis.set_visibility(false);
		};
		
		this.button_extra_actions = document.createElement("div");
		this.button_extra_actions.className = "no_user_select main_interface_buttons";
		this.button_extra_actions.id = "button_extra_actions";
		this.button_extra_actions.style.backgroundImage = SYMBOL_EXTRA_ACTIONS_BUTTON;
		this.button_extra_actions.onclick = function () {
			newScopeThis.toggle_visibility();
		};
		
		this.IS_VISIBLE = false;
		this.set_visibility(false);
	}
	
	
	get_div(){
		return this.popup_menu;
	}


	display_tab(int_index) {
		this.INDEX_SELECTED = int_index;
		const newScopeThis = this;

		const array_length = newScopeThis.button_list.length;
		
		//clear selection of the other tab buttons.
		for (var i = 0; i < array_length; i++) {
			newScopeThis.button_list[i].style.borderLeft = "0px solid #FFFFFF";
		}

		//update display of desired content, and update appearance of selected tab button.
		const selected_tab = newScopeThis.tab_pane_list[int_index];
		const selected_button = newScopeThis.button_list[int_index];
		newScopeThis.menu_display_area.innerHTML = selected_tab.get_inner_html();
		selected_button.style.borderLeft = "4px solid #FFFFFF";
		
	}
	
	add_tab_map(map_with_string_keys_and_string_values){
		var map_iterator = map_with_string_keys_and_string_values.entries();
		
		var string_state_representation = "";

		for (var i = 0; i < map_with_string_keys_and_string_values.size; i++) {
			var entry_at_i = map_iterator.next().value;

			var key_at_i = entry_at_i[0];
			var value_at_i = entry_at_i[1];
			
			this.add_tab(key_at_i, value_at_i);
		}
	}
	
	add_tab(string_description, string_content_of_menu_tab_pane) {
		
		var new_menu_tab_pane = new MenuTabPane(string_content_of_menu_tab_pane);
		
		const newScopeThis = this;
		this.tab_pane_list.push(new_menu_tab_pane);

		//create the button and display it.
		var new_button = document.createElement("div");
		new_button.className = "popup_menu_item no_user_select";
		new_button.id = "button_license";
		this.popup_menu.appendChild(new_button);
		new_button.innerText = string_description;
		new_button.style.borderLeft = "0px solid #FFFFFF";

		//add the button to the list of menu buttons.
		this.button_list.push(new_button);

		//add mechanisms to the button.
		const index_of_new_button = newScopeThis.button_list.length - 1;
		new_button.onclick = function () {
			newScopeThis.display_tab(index_of_new_button);
		}

		//select the tab to display if this is the first tab added.
		const current_button_list_length = index_of_new_button + 1;
		if (current_button_list_length == 1) {
			new_button.dispatchEvent(new Event('click'));
		}
	}



	set_height(int_pixels) {
		this.popup_menu.style.height = int_pixels + 0 + "px";
	}

	set_width(int_pixels) {
		this.popup_menu.style.width = int_pixels + 0 + "px";
	}

	

	toggle_visibility() {
		this.set_visibility( ! this.get_visibility());
	}

	get_visibility() {
		return this.IS_VISIBLE;
	}

	set_visibility(boolean_set_visible) {
		this.IS_VISIBLE = boolean_set_visible;
		const newScopeThis = this;
		if (newScopeThis.IS_VISIBLE == true) {
			newScopeThis.popup_menu.style.visibility = "visible";
			newScopeThis.popup_menu.style.opacity = 1.0;
		}
		else {
			newScopeThis.popup_menu.style.opacity = 0.0;

			//wait for complete fadeout before hiding the menu.
			setTimeout(function () {
				newScopeThis.popup_menu.style.visibility = "hidden";
			}, 500);
		}
	}

	get_button() {
		return this.button_extra_actions;
	}
}


class MenuTabPane {
	constructor(string_of_arbitrary_inner_html) {
		this.set_inner_html(string_of_arbitrary_inner_html);
	}


	set_inner_html(string_of_arbitrary_inner_html) {
		this.inner_html = string_of_arbitrary_inner_html;
	}

	get_inner_html() {
		return this.inner_html;
	}


}

