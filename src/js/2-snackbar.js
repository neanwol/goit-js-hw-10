import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(form);
    const delay = parseInt(formData.get('delay'));
    const state = formData.get('state');
    
    createPromise(delay, state)
        .then(delay => {
            iziToast.success({
                title: 'Success',
                message: `✅ Fulfilled promise in ${delay}ms`,
                position: 'topRight',
                timeout: 5000
            });
            console.log(`✅ Fulfilled promise in ${delay}ms`);
        })
        .catch(delay => {
            iziToast.error({
                title: 'Error',
                message: `❌ Rejected promise in ${delay}ms`,
                position: 'topRight',
                timeout: 5000
            });
            console.log(`❌ Rejected promise in ${delay}ms`);
        });

    form.reset();
});

function createPromise(delay, state) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === 'fulfilled') {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });
}