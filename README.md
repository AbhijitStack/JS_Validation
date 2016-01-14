# js_validation
Form Validation with Javascript

# TO initiate Form Validate call this function
# And pass id of the form as an argument

  Validation.Initiate("<id of the form>");
  
  EX:  Validation.Initiate("myform");

# TO define the Form validation rules

~ id : id of the field followed by additional paramenters.

Ex:
    Validation.fields = [
        {id: "newField", custom: "test"},
        {id: "name", type: "name"},
        {id: "password", maxlength: 10, minlength: 4, required: true, match: "repassword"},
        {id: "date", required: true},
        {id: "file", required: true},
        {id: "email", type: "email", number: 5},
        {id: "name", type: "name"},
        {id: "mobile", type: "mobile"},
        {id: "radio", type: "radio"},
        {id: "dropdown", type: "dropdown"}
    ];
