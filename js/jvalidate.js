/* JValidate 0.1 */
/* Simple and easy to use validation plugin inspired by Laravel validation. */

$(function() {

	$.fn.jvalidate = function(options) {

		/* Plugin's default settings */
		var settings = $.extend({
			validColor: '#43A047',
			errorColor: '#E53935',
			errorMessage: false,
			locale: 'nl'
		}, options);

		/* Variable declarations */
		var validation,
			input,
			elem,
			validationValue,
			switchCase,
			args,
			messageLocale,
			isValid,
			form;

		/* Store form in form variable */
		form = this;

		/* Serialize the form */
		form.serialize();

		/* Find every input the form has */
		form.find('input').each(function(key, element) {
			
			/* Store the input element in cache */
			input = $(element);

			/* On keyup and blur start the validation */
			input.on('keyup blur submit', function() {

				isValid = true;
				
				/* Store all set validation rules to array */
				/* Example use: <input type="text" data-validation="required|min:3|max:10 */
				validation = $(this).data('validation').split('|');

				/* Store the current element in elem for later use */
				/* Set autocomplete attribute to false to prevent Chrome adding autocomplete list */
				elem       = $(this);
				elem.attr('autocomplete', 'false');

				/* For each rule in validation array */
				$.each(validation, function(key, value) {

					/* Declare arguments as empty array */
					/* Split argument value on : and store them in validationValue */
					/* Store key in switchCase variable to use in switch case statement */
					args            = [];
					validationValue = value.split(':');
					switchCase      = validationValue[0];

					/* If rule has arguments, store them in the args array */
					if (validationValue.length > 1) {
						args = validationValue[1];
					}
					
					if(isValid) {

						switch(switchCase) {
							case 'required':

								if ($.trim(elem.val()).length === 0) {
									
									elem.addClass('has-error').removeClass('is-valid');
									isValid = false;

								} else {
									elem.removeClass('has-error').addClass('is-valid');
									isValid = true;
								}

								addErrorMessage(elem, switchCase, isValid);

								break;

							case 'iban':
								
								if(!IBAN.isValid(elem.val())) {
									elem.addClass('has-error').removeClass('is-valid');
									isValid = false;
								} else {
									elem.removeClass('has-error').addClass('is-valid');
									isValid = true;
								}

								addErrorMessage(elem, switchCase, isValid);

								break;
								
							case 'number': 

								var re = /^\d+$/;
								if(!re.test(elem.val())) {
									elem.addClass('has-error').removeClass('is-valid');
									isValid = false;
								} else {
									elem.removeClass('has-error').addClass('is-valid');
									isValid = true;
								}

								addErrorMessage(elem, switchCase, isValid);

								break;
								
							case 'email': 

								var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
								if(!re.test(elem.val())) {
									addErrorMessage(elem, switchCase);

									elem.addClass('has-error').removeClass('is-valid');
									isValid = false;
								} else {
									elem.removeClass('has-error').addClass('is-valid');
									isValid = true;
								}

								addErrorMessage(elem, switchCase, isValid);

								break;
								
							case 'regex': 

								var pattern = new RegExp("["+ args +"]$","i");
								if(!pattern.test(elem.val())) {
									elem.addClass('has-error').removeClass('is-valid');
									isValid = false;
								} else {
									elem.removeClass('has-error').addClass('is-valid');
									isValid = true;
								}

								break;
								
							case 'min':

								if($.trim(elem.val()).length < args) {
									elem.addClass('has-error').removeClass('is-valid');
									isValid = false;
								} else {
									elem.removeClass('has-error').addClass('is-valid');
									isValid = true;
								}

								addErrorMessage(elem, switchCase, isValid, args);

								break;
								
							case 'max':

								if($.trim(elem.val()).length > args) {
									elem.addClass('has-error').removeClass('is-valid');
									isValid = false;
								} else {
									elem.removeClass('has-error').addClass('is-valid');
									isValid = true;
								}

								addErrorMessage(elem, switchCase, isValid, args);

								break;
								
							default: 
								//Default
								break;
								
						}
						
					}
					
				});
			});

		});

		function addErrorMessage(elem, type, valid, args) {
			
			/* Make args optional by setting is undefined if not passed to function */
			args = args || undefined;

			/* Check if plugin setting is set to true */
			if(settings.errorMessage) {

				/* Check if element that is passed to function is valid */
				if (!valid) {

					/* Prevent message to be added multiple times by checking the length */
					if (!elem.siblings('span.jvalidate-error-message').length > 0) {

						/* If args is not undefined, get the message from locale file and replace %arg% with arguments that are passed to function */
						/* Example use   : 'min': 'This field needs a minimal length of %arg%' characters */
						/* Example output: 'This field need a minimal of 5 characters' */
						if (args !== undefined) {
							messageLocale = messages[type].replace('%arg%', args);
						} else {
							messageLocale = messages[type];
						}

						/* Validation message can be set as an HTML attribute to overwrite defaults in locale file. */
						/* Example use: <input type="text" data-validation="required" data-validation-message="This field is required, please fill in a value"> */
						/* Else if no attribute is set in HTML, use the default locale message */
						validationMessage = elem.data('validation-message') || messageLocale;

						/* Create a span element with the HTML of the validation message and insert it after the input in the DOM */
						$('<span />', {
							class: 'text-danger jvalidate-error-message',
							text: validationMessage
						}).insertAfter(elem);

					}

				} else if (valid) {
					/* If the input passes the validation, remove the error message */
					elem.siblings('span.jvalidate-error-message').remove();
				}

			}
		}
		
		form.on('submit', function(e) {
			
			form.find(':input').trigger('blur');

			if (!isValid) {
				console.log('cancel submit');
				e.preventDefault();
			}

		});

	};

}(jQuery));