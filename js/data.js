const apiUrl = "http://kingmasada-001-site1.htempurl.com/"


function loadDoctors() {
    loading("processing...")
   
    MobileUI.ajax.get(apiUrl + "/api/Doctors/GetAll")
        .then(res => {
            var result = res.body
            console.log(result[0])
            closeLoading()
            if (result.length < 1) {
                openToast("doctors list is empty")
            } else {
                for (x = 0; x <result.length; x++) {
                    var template = document.getElementById("doctorsTemplate").innerHTML
                    template = template.replace("%name", result[x].name)
                    template = template.replace("%specialisation", result[x].specialisation)
                    template = template.replace("%id", result[x].doctorId)
                    $("#doctorsArea").append(template)
                } 
            }
        }


        ).catch(err => {
            closeLoading()
            console.log(err)
            //alert(err.msg)
        })
}

function loadDoctorDetails() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
   

    loading("processing...")

    MobileUI.ajax.get(apiUrl + "/api/Doctors/"+id)
        .then(res => {
            var result = res.body
            console.log(result[0])
            closeLoading()
            document.getElementById("title").innerHTML="Doctor "+result[0].name
            
        }


        ).catch(err => {
            closeLoading()
            console.log(err)
            //alert(err.msg)
        })
}


function loadDoctorAppointments() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')


    loading("processing...")

    MobileUI.ajax.get(apiUrl + "/api/Appointments/GetForParticularDoctor?id=" + id)
        .then(res => {
            var result = res.body
            console.log(result)
            closeLoading()

            if (result.length < 1) {
                openToast("doctors appointments is empty")
            } else {
                for (x = 0; x < result.length; x++) {
                    var template = document.getElementById("appointmentsTemplate").innerHTML
                    template = template.replace("%name", result[x].patients.name)
                    var d = new Date(result[x].from);
                    template = template.replace("%from", d.toUTCString())
                    var e = new Date(result[x].to);
                    template = template.replace("%to", e.toUTCString())
                    template = template.replace("%phone", result[x].patients.phone)
                    template = template.replace("%reason", result[x].reason)
                    $("#appointmentsArea").append(template)
                }
            }
           

        }


        ).catch(err => {
            closeLoading()
            console.log(err)
            //alert(err.msg)
        })
}

function patientInfo() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const doctor = urlParams.get('doctor')

    const obj = MobileUI.objectByForm('patientForm')
    console.log(obj)
    loading("processing...")
    MobileUI.ajax.post(apiUrl + "/api/Patients/Insert")
        .send(obj)
        .set("Accept", "application/json")
        .then(res => {
            closeLoading()

            openToast({
                message: 'Saved!',
                position: 'top'
            })

            var result = res.body
            console.log(result)
            setTimeout(function () {
                var patient = result.patientId
                location.assign('makeAppointment.html?doctor=' + doctor+"&patient="+patient)
            },3000)
        }


        ).catch(err => {

            console.log(err)
            openToast("error!")
            closeLoading()

        })
   
}

function newAppointment() {
    loading("processing...")
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const doctor = urlParams.get('doctor')
    const patient = urlParams.get('patient')

    var from = $('#datetimepicker0').val()
    var to = $('#datetimepicker').val()
    var reason = $('#Reason').val()
    var venue = $('#venue').val()
    var obj = {}
    obj.patientId = patient
    obj.doctorId = doctor
    obj.to = to
    obj.from = from
    obj.reason = reason
    obj.venue = venue

    MobileUI.ajax.post(apiUrl + "/api/Appointments/check?pDateTimeFrom=" + from +"&pDateTimeTo="+to+"&id="+doctor)
        .then(res => {
            var result = res.body
            console.log(result)
            closeLoading()

            if (result.length < 1) {


                loading("processing...")
                MobileUI.ajax.post(apiUrl + "/api/Appointments/Insert")
                    .send(obj)
                    .set("Accept", "application/json")
                    .then(res => {
                        closeLoading()

                        openToast({
                            message: 'appointment Saved successfully!',
                            position: 'top'
                        })

                        var result = res.body
                        console.log(result)
                        
                    }


                    ).catch(err => {

                        console.log(err)
                        openToast("error!")
                        closeLoading()

                    })




            } else {
                alert("choose another date or time. there is already an appointment overlapping the periode you have chosen")
            }


        }
    ).catch(err => {
        closeLoading()
        console.log(err)
        //alert(err.msg)
    })
}