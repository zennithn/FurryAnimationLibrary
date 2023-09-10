/**
 * ZENNITH'S FURRY ANIMATION LIBRARY (VERSION 2023-09)
 * This HTML and associated Javascript application was written by Zennith. Copyright 2020,2023.
 * It is covered by a GPL-3.0-or-later license. Please note disclaimers of liability in the 
 * GPL-3.0-or-later license apply in full force if you use this program.
 */



class URLState {
	constructor() {
		this.map_of_known_data = new Map();
		this.map_of_default_values = new Map();
	}
	
	/**
	 * Makes URLState aware of a type of data you are interested in in the URL variables.
	 * This adds a key, an array of values that you declare as being valid for that key,
	 * and a default value that is selected if no other input is provided by the user.
	 */
	declare_known_url_parameter(string_key, array_string_valid_values, string_default_value){
		this.map_of_known_data.set(string_key, array_string_valid_values);
		this.map_of_default_values.set(string_key, string_default_value);
		
	}
	
	
	/**
	 * Finds the value corresponding to the string_key you provide, as long
	 * as that key exists in the known url parameters. If the user's web browser does
	 * not already have data corresponding to your parameter, or if it has unexpected data,
	 * this method will instead find the default string value for that key.
	 *
	 * Once finding the value of interest, this method will ensure that the browser's 
	 * URL is properly updated. If the browser's URL doesn't already have a key and valid value
	 * present, this method will write the key and its default value into the URL.
	 *
	 * Finally, this method returns the appropriate string value. 
	 */
	peek_and_sync_known_url_parameter(string_key){
		var default_value = this.map_of_default_values.get(string_key);
		var valid_values = this.map_of_known_data.get(string_key);
		
		var value_from_url = this.hard_peek_value_at_key(string_key);
		
		var value_to_return = "";
		var valid_match_found = false;
		
		if(
			value_from_url != undefined
			&& value_from_url != null
			&& value_from_url.length > 0
		){
			for (var i = 0; i < valid_values.length; i++) {
				var test_value = valid_values[i];
				if(test_value === value_from_url){
					value_to_return = test_value + "";
					valid_match_found = true;
				}
			}
		}
		
		if( !valid_match_found){
			value_to_return = default_value + "";
		}
		
		this.hard_set_value_at_key(string_key, value_to_return);
		
		return value_to_return;
	}
	
	/**
	 * Safely sets a value at a key in the URL parameters, but only 
	 * if the provided string_value is in the list of valid values you have declared 
	 * in declare_known_url_parameter().
	 * 
	 * If the string_value is unknown, this method will
	 * instead set the default value to the key you have specified.
	 */
	set_known_url_parameter(string_key, string_value){
		console.log("set_known_url_parameter");
		var default_value = this.map_of_default_values.get(string_key);
		var valid_values = this.map_of_known_data.get(string_key);
		
		var value_to_set_to_url = "";
		var valid_match_found = false;
		
		if(
			string_value != undefined
			&& string_value != null
			&& string_value.length > 0
		){
			for (var i = 0; i < valid_values.length; i++) {
				var test_value = valid_values[i];
				if(test_value === string_value){
					value_to_set_to_url = test_value + "";
					valid_match_found = true;
				}
			}
		}
		
		if( !valid_match_found){
			value_to_set_to_url = default_value + "";
		}
		
		this.hard_set_value_at_key(string_key, value_to_set_to_url);
	}
	
	
	/**
	 * Returns a string representing the base URL, with all parameters stripped.
	 */
	peek_base_url(){
		var full_url = window.location.href;
		
		//looks in the URL for a "?", signifying the start of parameters in the URL.
		var url_parts = full_url.split("?");
		
		//we will drop everything in the URL including and after the first "?".
		full_url = url_parts[0];
		
		return full_url;
	}
	
	
	
	/**
	 * Returns a new Map of all key-value pairs found in the window's URL. This method has
	 * no knowledge of which key-value pairs you are interested in.
	 * This method does not mutate the URL, nor does it modify any data within any 
	 * URLState object you might already have.
	 */
	peek_url_vars(){
		var return_map = new Map();
		
		var full_url = window.location.href;
		
		//looks in the URL for a "?", signifying the start of parameters in the URL.
		var url_parts = full_url.split("?");

		var url_params_string = "";
		
		//if the URL contains parameters...get any values present.
		if(url_parts.length >= 2){
			url_params_string = url_parts[1];
			
			//make sure at least some text is actually after the questionmark.
			if(url_params_string.length > 1){
				
				var url_params_raw_array = url_params_string.split("&");

				//for each element in the array, try to split into key-value pairs.
				for(const element of url_params_raw_array){
					
					//the element has to at least be 2 characters long, e.g. K=, to
					//possibly represent a key-value pair without a value defined.
					if(element.length >= 2){
						var split_string = element.split("=");
						
						//only accept the key-value pair if the string was exactly split in two.
						if(split_string.length == 2){
							var key_string = split_string[0];
							var val_string = split_string[1];
							return_map.set(key_string, val_string);
						}					
					}					
				}				
			}
		}
		
		//if the URL doesn't have any parameters in it... not much we can do!
		else{
		}
		
		
		return return_map;
	}
	
	
	/**
	 * Writes a map of all parameters you provide (e.g. ?param1=valueA&param2=valueB) to the URL.
	 *
	 * @param The params map. It must be a Map object with string keys and string values.
	 */
	set_url_vars(params_map){
		var params_map_iterator = params_map.entries();
		
		var string_state_representation = "";

		for (var i = 0; i < params_map.size; i++) {
			var entry_at_i = params_map_iterator.next().value;

			var key_at_i = entry_at_i[0];
			var value_at_i = entry_at_i[1];

			var key_value_string = key_at_i + "=" + value_at_i;
			
			if(string_state_representation.indexOf("?") < 0){
				string_state_representation = "?" + key_value_string;
			}
			else{
				string_state_representation = string_state_representation + "&" + key_value_string;
			}
		}
		

		var full_url = window.location.href;
		
		//looks in the URL for a "?", signifying the start of parameters in the URL.
		var url_parts = full_url.split("?");
		
		//we will drop everything in the URL after the first "?", because we are 
		//overwriting all parameters.
		full_url = url_parts[0] + string_state_representation;
		
		
		
		history.replaceState(null, '', full_url);
	}
	


	hard_set_value_at_key(string_key, string_value) {
		var working_map = this.peek_url_vars();
		
		working_map.set(string_key, string_value);
		
		this.set_url_vars(working_map);
		
	}


	/**
	 * Unconditionally looks for the data corresponding to the key you provide in
	 * the user browser's URL. This method may return blank data or null.
	 */
	hard_peek_value_at_key(string_key) {
		var working_map = this.peek_url_vars();

		return working_map.get(string_key);
	}


}






