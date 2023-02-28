// Đối tượng `Validator`
function Validator(options) {
  var selectorRules = {}
  // Hàm tìm element form-group
  function getParent(element, selector) {
    console.log(element);
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement
      }
      element = element.parentElement
    }
  }
  // Hàm thực hiện validate
  function validate(inputElement, rule) {
    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
    var errorMsg = rule.test(inputElement.value)
    if (errorMsg) {
      errorElement.innerText = errorMsg
      getParent(inputElement, options.formGroupSelector).classList.add('invalid')
    } else {
      errorElement.innerText = ''
      getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
    }
    return !errorMsg
  }

  // Lấy element của form cần validate
  var formElement = document.querySelector(options.form)
  if (formElement) {
    // Submit form
    formElement.onsubmit = function (e) {
      e.preventDefault()

      var isFormValid = true
      // Check validate
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector)
        var isValid = validate(inputElement, rule)
        if (!isValid) {
          isFormValid = false
        }
      })
      if (isFormValid) {
        // Submit với js
        if (typeof options.onSubmit === 'function') {
          var enableInputs = document.querySelectorAll('#form-1 [name]')
          var formValues = Array.from(enableInputs).reduce(function (values, input) {
            values[input.name] = input.value
            return values
          }, {})
          options.onSubmit(formValues)
          alert('Đăng ký thành công')
        }
        // Submit với hành vi mặc định
        else {
          formElement.submit()
        }
      }
    }

    options.rules.forEach(function (rule) {
      // Lưu lại các rules cho mỗi input
      selectorRules[rule.selector] = rule.test

      var inputElement = formElement.querySelector(rule.selector)
      if (inputElement) {
        // Xử lí khi blur
        inputElement.onblur = function () {
          validate(inputElement, rule)
        }
        // Xử lí khi nhập vào input
        inputElement.oninput = function () {
          if (inputElement.value) {
            var errorElement = getParent(inputElement, options.formGroupSelector).querySelector('.form-message')
            errorElement.innerText = ''
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
          }
        }
      }
    })
  }
}

// Định nghĩa các rules
Validator.isName = function (selector, msg1, msg2) {
  return {
    selector,
    test: function (value) {
      var nameRegex = /^[a-z A-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý\\s]+$/
      if (value.trim() == '') {
        return msg1 || 'Vui lòng nhập trường này'
      } else if (value.match(nameRegex)) {
        return undefined
      } else {
        return msg2 || 'Giá trị nhập vào không đúng'
      }
    }
  }
}

Validator.isEmail = function (selector, msg1, msg2) {
  return {
    selector,
    test: function (value) {
      var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      if (value.trim() == '') {
        return msg1 || 'Vui lòng nhập trường này'
      } else if (emailRegex.test(value)) {
        return undefined
      } else {
        return msg2 || 'Trường này phải là email'
      }
    }
  }
}

Validator.isPassword = function (selector, msg1, msg2) {
  return {
    selector,
    test: function (value) {
      var passwRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/
      if (value.trim() == '') {
        return msg1 || 'Vui lòng nhập trường này'
      } else if (passwRegex.test(value)) {
        return undefined
      } else {
        return msg2 || 'Giá trị nhập vào không chính xác'
      }
    }
  }
}

// 1. Lấy ra value password
// 2. So sánh với passwConfirm
Validator.isPasswordConfirmation = function (selector, getConfirmValue, msg1, msg2) {
  return {
    selector,
    test: function (value) {
      if (value.trim() == '') {
        return msg1 || 'Vui lòng nhập trường này'
      } else if (value === getConfirmValue()) {
        return undefined
      } else {
        return msg2 || 'Giá trị nhập vào không chính xác'
      }
    }
  }
}
