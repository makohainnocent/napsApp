function moveBack(){
  history.back();
}

function viewDoctorAppointments() {
    var id = document.querySelector('input[name="doctor"]:checked').value

    location.assign('doctorAppointments.html?id='+id)
}

function createAppointment() {
    var id = document.querySelector('input[name="doctor"]:checked').value
  location.assign('makeAppointment0.html?doctor='+id)
}