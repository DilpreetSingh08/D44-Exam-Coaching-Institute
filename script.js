// Select HTML elements from index.html
const enquiryForm = document.getElementById('enquiryForm');
const courseSelect = document.getElementById('courseSelect');
const studyKitCheckbox = document.getElementById('studyKit');
const estimatedFeeText = document.getElementById('estimatedFee');
const formMessage = document.getElementById('formMessage');
const enquiryList = document.getElementById('enquiryList');
const clearAllBtn = document.getElementById('clearAllBtn');

// Load existing enquiries from Local Storage or start with an empty array
let savedEnquiries = JSON.parse(localStorage.getItem('d44Enquiries')) || [];

// 1. Live Fee Estimator Function (DOM Update)
function updateEstimatedFee() {
  const selectedOption = courseSelect.options[courseSelect.selectedIndex];
  const baseFee = Number(selectedOption.getAttribute('data-fee')) || 0;
  const kitFee = (baseFee > 0 && studyKitCheckbox.checked) ? 3500 : 0;
  const totalFee = baseFee + kitFee;

  estimatedFeeText.textContent = '₹' + totalFee.toLocaleString('en-IN');
  return totalFee;
}

// Recalculate fee whenever course or study material checkbox changes
courseSelect.addEventListener('change', updateEstimatedFee);
studyKitCheckbox.addEventListener('change', updateEstimatedFee);

// 2. Render Saved Enquiries List in the DOM
function displayEnquiries() {
  enquiryList.innerHTML = '';

  if (savedEnquiries.length === 0) {
    enquiryList.innerHTML = '<li>No saved enquiries yet. Select a batch on the left to estimate fees.</li>';
    return;
  }

  for (let i = 0; i < savedEnquiries.length; i++) {
    const item = savedEnquiries[i];
    const li = document.createElement('li');
    li.innerHTML =
      '<div>' +
        '<strong>' + item.name + '</strong> – ' + item.course + '<br>' +
        '<small>Estimated Fee: ' + item.fee + ' | Join Date: ' + item.date + ' | Phone: ' + item.phone + '</small>' +
      '</div>' +
      '<button type="button" class="btn-delete" onclick="removeEnquiry(' + i + ')">Remove</button>';
    enquiryList.appendChild(li);
  }
}

// 3. Delete a Single Saved Enquiry
function removeEnquiry(index) {
  savedEnquiries.splice(index, 1);
  localStorage.setItem('d44Enquiries', JSON.stringify(savedEnquiries));
  displayEnquiries();
}

// 4. Form Validation & Local Storage Save on Submit
enquiryForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const name = document.getElementById('studentName').value.trim();
  const phone = document.getElementById('studentPhone').value.trim();
  const email = document.getElementById('studentEmail').value.trim();
  const date = document.getElementById('startDate').value;
  const course = courseSelect.value;
  const totalFee = updateEstimatedFee();

  // Check if all inputs are valid
  if (name.length < 2) {
    formMessage.className = 'feedback-msg feedback-error';
    formMessage.textContent = 'Please enter a valid student name (at least 2 characters).';
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    formMessage.className = 'feedback-msg feedback-error';
    formMessage.textContent = 'Please enter a valid 10-digit mobile number.';
    return;
  }

  if (!email.includes('@') || !email.includes('.')) {
    formMessage.className = 'feedback-msg feedback-error';
    formMessage.textContent = 'Please enter a valid email address.';
    return;
  }

  if (!date || course === '') {
    formMessage.className = 'feedback-msg feedback-error';
    formMessage.textContent = 'Please select a preferred joining date and a target course batch.';
    return;
  }

  // Create enquiry object and save to Local Storage
  const newRecord = {
    name: name,
    phone: phone,
    email: email,
    date: date,
    course: course,
    fee: '₹' + totalFee.toLocaleString('en-IN')
  };

  savedEnquiries.push(newRecord);
  localStorage.setItem('d44Enquiries', JSON.stringify(savedEnquiries));

  // Show success message and reset form
  formMessage.className = 'feedback-msg feedback-success';
  formMessage.textContent = 'Enquiry saved for ' + name + '! Estimated Fee: ' + newRecord.fee;

  enquiryForm.reset();
  updateEstimatedFee();
  displayEnquiries();
});

// 5. Clear All Saved Enquiries
clearAllBtn.addEventListener('click', function () {
  savedEnquiries = [];
  localStorage.removeItem('d44Enquiries');
  displayEnquiries();
});

// Load saved enquiries when the page opens
displayEnquiries();