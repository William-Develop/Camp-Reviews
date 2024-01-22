// <!-- JavaScript for disabling form submissions if there are invalid fields -->
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        // If the form is not valid, prevent its submission
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        // Add the 'was-validated' class to the form to change its appearance
        form.classList.add('was-validated')
      }, false)
    })
  })()