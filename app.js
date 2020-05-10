// Exam Class: Represents a exam
class Exam {
  constructor(name, professor, date) {
    this.name = name;
    this.professor = professor;
    this.date = date;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayExams(){
    const exams = Store.getExams();

    exams.forEach((exam) => UI.addExamToList(exam));
  }

  static addExamToList(exam) {
    const list = document.querySelector('#exam-list');

    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="padding: 0px 0px 0px 12px; vertical-align: middle;">${exam.name}</td>
      <td style="padding: 0px 0px 0px 12px; vertical-align: middle;">${exam.professor}</td>
      <td style="padding: 0px 0px 0px 12px; vertical-align: middle;">${exam.date}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">Remove</a></td>
    `;

    list.appendChild(row);
  }

  static deleteExam(el) {
    if(el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#exam-form');
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#name').value = '';
    document.querySelector('#professor').value = '';
    document.querySelector('#date').value = '';
  }
}

// Store Class: Handles Storage
  class Store {
    static getExams() {
      let exams;
      if(localStorage.getItem('exams') === null) {
        exams = [];
      } else {
        exams = JSON.parse(localStorage.getItem('exams'));
      }

      return exams;
    }

    static addExam(exam) {
      const exams = Store.getExams();
      exams.push(exam);
      localStorage.setItem('exams', JSON.stringify(exams));
    }

    static removeExam(date){
      const exams = Store.getExams();

      exams.forEach((exam, index) =>{
          if(exam.date === date) {
            exams.splice(index, 1);
          }
      });

      localStorage.setItem('exams', JSON.stringify(exams));
    }
  }

// Event: Display MyExamList
document.addEventListener('DOMContentLoaded', UI.displayExams);

// Event: Add a exam
document.querySelector('#exam-form').addEventListener('submit', (e) => {
  //Prevent Actual Submit
  e.preventDefault();

  //Get Form Values
  const name = document.querySelector('#name').value;
  const professor = document.querySelector('#professor').value;
  const date = document.querySelector('#date').value;

  //Validate
  if(name === '' || professor === '' || date === ''){
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    // Instantiate exam
    const exam = new Exam(name, professor, date);

    // Add Exam to UI
    UI.addExamToList(exam);

    // Add Exam to Store
    Store.addExam(exam);

    // Show success message
    UI.showAlert('Exam Added', 'success');

    // Clear Fields
    UI.clearFields();
  }
});

// Event: Remove a Exam
document.querySelector('#exam-list').addEventListener('click', (e) => {
  //Remove exam from UI
  UI.deleteExam(e.target);

  //Remove exam from store
  Store.removeExam(e.target.parentElement.previousElementSibling.textContent);

  // Show removed message
  UI.showAlert('Exam Removed', 'success');
});
