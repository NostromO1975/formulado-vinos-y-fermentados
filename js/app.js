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
                <input type="number" class="cantidad" name="cantidad${ingredientesActivos}" min="0" step="1" placeholder="Ej: 500">
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

    // Función para calcular la fermentación - VERSIÓN CORREGIDA
    document.getElementById('calcular').addEventListener('click', function() {
        const tipoBebida = document.getElementById('tipo-bebida').value;
        const ingredientes = [];
        let totalAzucar = 0;
        let totalGramos = 0;

        // Recoger datos de cada ingrediente
        for (let i = 1; i <= ingredientesActivos; i++) {
            const select = document.querySelector(`select[name="ingrediente${i}"]`);
            const cantidadInput = document.querySelector(`input[name="cantidad${i}"]`);
            const cantidad = parseFloat(cantidadInput ? cantidadInput.value : 0) || 0;
            
            if (select && select.value && cantidad > 0) {
                let azucar;
                let nombre;
                
                if (select.value === 'otro') {
                    const otroNombreInput = document.querySelector(`input[name="otro-ingrediente${i}"]`);
                    const otroAzucarInput = document.querySelector(`input[name="otro-azucar${i}"]`);
                    
                    nombre = otroNombreInput ? otroNombreInput.value : 'Ingrediente personalizado';
                    azucar = otroAzucarInput ? parseFloat(otroAzucarInput.value) / 100 : 0;
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
        const alcoholPotencial = (totalAzucar / 17).toFixed(1);
        
        // Mostrar resultados en la página
        document.getElementById('result-tipo-bebida').textContent = formatNombreFruta(tipoBebida);
        document.getElementById('result-alcohol').textContent = alcoholPotencial;
        document.getElementById('result-azucar').textContent = totalAzucar.toFixed(1);
        
        // Mostrar fecha actual
        const ahora = new Date();
        document.getElementById('result-fecha').textContent = ahora.toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        // Listar ingredientes
        const listaIngredientes = document.getElementById('result-ingredientes');
        listaIngredientes.innerHTML = '';
        ingredientes.forEach(ing => {
            const li = document.createElement('li');
            li.textContent = `${ing.nombre}: ${ing.cantidad}g (${ing.azucar.toFixed(1)}g azúcar)`;
            listaIngredientes.appendChild(li);
        });
        
        // Generar recomendaciones
        const recomendaciones = generarRecomendaciones(tipoBebida, alcoholPotencial);
        document.getElementById('result-recomendaciones').innerHTML = recomendaciones;
        
        // Mostrar sección de resultados
        document.getElementById('resultados').style.display = 'block';
        
        // Scroll automático a los resultados
        document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
    });

    // Función para generar recomendaciones
    function generarRecomendaciones(tipoBebida, alcohol) {
        let recomendaciones = '';
        
        // Recomendaciones generales por tipo de bebida
        switch(tipoBebida) {
            case 'guarapo':
                recomendaciones += `<p>El guarapo tradicional se fermenta entre 3-5 días. Revise diariamente el olor y sabor.</p>`;
                break;
            case 'chicha':
                recomendaciones += `<p>La chicha requiere fermentación más larga (5-8 días). Mantenga en recipiente de barro si es posible.</p>`;
                break;
            case 'masato':
                recomendaciones += `<p>El masato necesita 2-3 días de fermentación con la cáscara de piña para activar levaduras naturales.</p>`;
                break;
            default:
                recomendaciones += `<p>Fermente a temperatura ambiente (20-25°C) por 4-7 días.</p>`;
        }
        
        // Recomendaciones por nivel de alcohol
        const alcoholNum = parseFloat(alcohol);
        if (alcoholNum > 12) {
            recomendaciones += `<p class="warning">¡Alto contenido alcohólico! Considere diluir con agua antes de fermentar.</p>`;
        } else if (alcoholNum < 6) {
            recomendaciones += `<p>Bajo contenido alcohólico. Puede añadir más azúcar o fermentar menos tiempo.</p>`;
        }
        
        recomendaciones += `<p>Controle la fermentación: debe haber burbujas pero no olor avinagrado.</p>`;
        
        return recomendaciones;
    }

    // Función auxiliar para formatear nombres de frutas
    function formatNombreFruta(key) {
        if (!key) return '';
        return key.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
});