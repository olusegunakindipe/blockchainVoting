function validate(elem){
    var anum = /(^234(\d){10}$)/;

    if(anum.test(elem.value) ==true)
    {
        elem.style.border="2px solid #0F0";//green light
    }
    else{
        elem.style.border = "2px solid #F00"; //red light
    }
}




























// $(document).ready(function() {
//     $('#contact_form').bootstrapValidator({
//         // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
//         feedbackIcons: {
//             valid: 'glyphicon glyphicon-ok',
//             invalid: 'glyphicon glyphicon-remove',
//             validating: 'glyphicon glyphicon-refresh'
//         },
//         fields: {
//             first_name: {
//                 validators: {
//                         stringLength: {
//                         min: 2,
//                     },
//                         notEmpty: {
//                         message: 'Please supply your first name'
//                     }
//                 }
//             },
//              last_name: {
//                 validators: {
//                      stringLength: {
//                         min: 2,
//                     },
//                     notEmpty: {
//                         message: 'Please supply your last name'
//                     }
//                 }
//             },
//             DOB: {
//                 validators: {
//                     notEmpty: {
//                         message: 'Please supply your email address'
//                     },
//                     DateOfBirth: {
//                         message: 'Please supply a valid email address'
//                     }
//                 }
//             },
//             phone: {
//                 validators: {
//                     notEmpty: {
//                         message: 'Please supply your phone number'
//                     },
//                     phone: {
//                         country: 'NIG',
//                         message: 'Please supply a vaild phone number with area code'
//                     }
//                 }
//             },
//             address: {
//                 validators: {
//                      stringLength: {
//                         min: 8,
//                     },
//                     notEmpty: {
//                         message: 'Please supply your street address'
//                     }
//                 }
//             },
//             city: {
//                 validators: {
//                      stringLength: {
//                         min: 4,
//                     },
//                     notEmpty: {
//                         message: 'Please supply your city'
//                     }
//                 }
//             },
//             state: {
//                 validators: {
//                     notEmpty: {
//                         message: 'Please select your state'
//                     }
//                 }
//             },
//             NIN: {
//                 validators: {
//                     notEmpty: {
//                         message: 'Please supply your NIN'
//                     },
//                     National_Identification_Number: {
//                         country: 'NIG',
//                         message: 'Please supply a vaild NIN'
//                     }
//                 }
//             },
           
//             }
//         })
//         .on('success.form.bv', function(e) {
//             $('#success_message').slideDown({ opacity: "show" }, "slow") // Do something ...
//                 $('#contact_form').data('bootstrapValidator').resetForm();

//             // Prevent form submission
//             e.preventDefault();

//             // Get the form instance
//             var $form = $(e.target);

//             // Get the BootstrapValidator instance
//             var bv = $form.data('bootstrapValidator');

//             // Use Ajax to submit form data
//             $.post($form.attr('action'), $form.serialize(), function(result) {
//                 console.log(result);
//             }, 'json');
//         });
// });

