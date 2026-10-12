const requestedService=new URLSearchParams(location.search).get('service');
if(requestedService){const queryField=document.querySelector('#query');if(queryField&&!queryField.value)queryField.value=`I'm interested in: ${requestedService}`;}
document.querySelector('#appointment-form')?.addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.currentTarget;
  if(!form.reportValidity()) return;
  const values=new FormData(form);
  const subject=encodeURIComponent('Appointment enquiry — Multani Plastic Surgery Centre');
  const body=encodeURIComponent(`Name: ${values.get('name')}\nEmail: ${values.get('email')}\nPhone: ${values.get('phone')||'Not provided'}\n\nQuery:\n${values.get('query')}`);
  window.location.href=`mailto:jangpreetsingh@yahoo.co.in?subject=${subject}&body=${body}`;
});
