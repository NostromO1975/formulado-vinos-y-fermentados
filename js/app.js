document.addEventListener('DOMContentLoaded', function() {
    // Datos de contenido de azúcar por fruta (g/100g)
    const azucarPorFruta = {
        'naranja': 9.4,
        'mandarina': 10.6,
        'manzana': 13.8,
        'uva': 16.1,
        'guayaba': 8.9,
        'corozo-morado': 12.5,
        'corozo-amarillo': 11.8,
        'golupa': 10.2,
        'panela': 95.0,
        'miel': 82.1,
        'azucar-blanca': 99.8,
        'azucar-morena': 97.0,
        'arroz': 0.3,
        'maiz': 1.9,
        'maracuya': 11.2,
        'mora': 4.9,
        'mango': 14.8,
        'mucilago': 2.1,
        'lulo': 3.7,
        'ciruela': 11.4,
        'durazno': 8.4,
        'uchuva': 5.8,
        'granadilla': 13.4
    };

    let ingredientesActivos = 1; // Comenzamos con 1 ingrediente

    // Mostrar/ocultar campos "Otro ingrediente"
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('ingrediente-select')) {
            const container = e.target.closest('.ingrediente').querySelector('.otro-ingrediente-container');
            container.style.display = e.target.value === 'otro' ? 'block' : 'none';
        }
    });

    // Añadir nuevo ingrediente
    document.getElementById('agregar-ingrediente').addEventListener('click', function() {
        if (ingredientesActivos >= 4) {
            alert('Máximo 4 ingredientes permitidos');
            return;
        }

        ingredientesActivos++;
        const nuevoIngrediente = document.createElement('div');
        nuevoIngrediente.className = 'ingrediente';
        nuevoIngrediente.innerHTML = `
            <div class="form-group">
                <label>Ingrediente ${ingredientesActivos}:</label>
                <select class="ingrediente-select" name="ingrediente${ingredientesActivos}">
                    <option value="">--Seleccione--</option>
                    ${Object.keys(azucarPorFruta).map(fruta => 
                        `<option value="${fruta}">${formatNombreFruta(fruta)}</option>`
                    ).join('')}
                    <option value="otro">Otro (especificar)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Cantidad (gramos):</label>
                <input type="number" class="cantidad" name="cantidad${ingredientesActivos}" min="0" step="100" value="0">
            </div>
            <div class="otro-ingrediente-container" style="display: none;">
                <label>Nombre del ingrediente:</label>
                <input type="text" class="otro-ingrediente" name="otro-ingrediente${ingredientesActivos}">
                
                <label>Contenido de azúcar (g/100g):</label>
                <input type="number" class="otro-azucar" name="otro-azucar${ingredientesActivos}" step="0.1" min="0" max="100">
            </div>
        `;
        document.querySelector('.ingredientes-container').appendChild(nuevoIngrediente);
    });

    // Función para calcular la fermentación
    document.getElementById('calcular').addEventListener('click', function() {
        const tipoBebida = document.getElementById('tipo-bebida').value;
        const ingredientes = [];
        let totalAzucar = 0;
        let totalGramos = 0;

        // Recoger datos de cada ingrediente
        for (let i = 1; i <= ingredientesActivos; i++) {
            const select = document.querySelector(`select[name="ingrediente${i}"]`);
            const cantidad = parseFloat(document.querySelector(`input[name="cantidad${i}"]`).value) || 0;
            
            if (select.value && cantidad > 0) {
                let azucar;
                let nombre;
                
                if (select.value === 'otro') {
                    nombre = document.querySelector(`input[name="otro-ingrediente${i}"]`).value;
                    azucar = parseFloat(document.querySelector(`input[name="otro-azucar${i}"]`).value) / 100;
                } else {
                    nombre = formatNombreFruta(select.value);
                    azucar = azucarPorFruta[select.value] / 100;
                }
                
                const azucarEnIngrediente = cantidad * azucar;
                
                ingredientes.push({
                    nombre,
                    cantidad,
                    azucar: azucarEnIngrediente
                });
                
                totalAzucar += azucarEnIngrediente;
                totalGramos += cantidad;
            }
        }

        if (ingredientes.length === 0) {
            alert('Por favor ingresa al menos un ingrediente con cantidad');
            return;
        }

        // Calcular alcohol potencial (simplificado)
        // 17 g/L de azúcar ≈ 1% alcohol
        const alcoholPotencial = (totalAzucar / 17).toFixed(1);
        
        // Mostrar resultados (por ahora en consola)
        console.log('Tipo de bebida:', tipoBebida);
        console.log('Ingredientes:', ingredientes);
        console.log('Azúcar total (g):', totalAzucar.toFixed(1));
        console.log('Alcohol potencial (%):', alcoholPotencial);
        
        // Aquí luego implementaremos mostrar los resultados en la página
        alert(`Cálculo completado. Alcohol potencial estimado: ${alcoholPotencial}%`);
    });

    // Función auxiliar para formatear nombres de frutas
    function formatNombreFruta(key) {
        return key.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
});