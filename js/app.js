// Aquí irá la lógica de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('Aplicación cargada');
    document.getElementById('fruta').addEventListener('change', function() {
        const otroContainer = document.getElementById('otro-fruta-container');
        if (this.value === 'otro') {
            otroContainer.style.display = 'block';
        } else {
            otroContainer.style.display = 'none';
        }
    });
    // Eventos y funciones se agregarán aquí
});