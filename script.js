document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS AND CONTEXT ---
    const canvas = document.getElementById('whiteboard');
    const ctx = canvas.getContext('2d');
    const container = document.querySelector('.canvas-container');
    const coordinates = document.getElementById('coordinates');

    // --- STATE VARIABLES ---
    let isDrawing = false;
    let isPanning = false;
    let isPinching = false; // For pinch-to-zoom state

    let currentTool = 'draw';
    let currentColor = '#ffffff';
    let currentBrushSize = 5;

    let currentElement = null;
    const drawingState = { elements: [] };
    
    const viewState = {
        scale: 1,
        panX: 0,
        panY: 0
    };
    
    let lastPanPoint = { x: 0, y: 0 };
    let initialPinchDistance = 0; // To calculate zoom ratio

    // --- HELPER FUNCTIONS ---

    // Calculate distance between two touch points
    function getTouchDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Calculate the midpoint between two touch points
    function getMidpoint(touch1, touch2) {
        return {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        };
    }

    // --- CANVAS SIZING AND RENDERING ---
    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        redrawCanvas();
    }

    function redrawCanvas() {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        ctx.save();
        ctx.translate(viewState.panX * viewState.scale, viewState.panY * viewState.scale);
        ctx.scale(viewState.scale, viewState.scale);

        drawingState.elements.forEach(element => drawElement(element));

        if (isDrawing && currentElement) {
            drawElement(currentElement);
        }
        ctx.restore();
    }

    function drawElement(element) {
        ctx.strokeStyle = element.color;
        ctx.lineWidth = element.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        switch (element.type) {
            case 'rectangle': {
                const [x1, y1] = element.points[0];
                const [x2, y2] = element.points[1];
                ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
                break;
            }
            case 'circle': {
                const [x1, y1] = element.points[0];
                const [x2, y2] = element.points[1];
                const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                ctx.beginPath();
                ctx.arc(x1, y1, radius, 0, Math.PI * 2);
                ctx.stroke();
                break;
            }
            case 'triangle': {
                const [x1, y1] = element.points[0];
                const [x2, y2] = element.points[1];
                ctx.beginPath();
                ctx.moveTo((x1 + x2) / 2, y1);
                ctx.lineTo(x1, y2);
                ctx.lineTo(x2, y2);
                ctx.closePath();
                ctx.stroke();
                break;
            }
            case 'trapezium': {
                const [x1, y1] = element.points[0];
                const [x2, y2] = element.points[1];
                const width = x2 - x1;
                const offset = width * 0.2;
                ctx.beginPath();
                ctx.moveTo(x1 + offset, y1);
                ctx.lineTo(x2 - offset, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x1, y2);
                ctx.closePath();
                ctx.stroke();
                break;
            }
            case 'line': {
                const [x1, y1] = element.points[0];
                const [x2, y2] = element.points[1];
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                break;
            }
            case 'draw': {
                if (element.points.length < 2) return;
                ctx.beginPath();
                ctx.moveTo(element.points[0][0], element.points[0][1]);
                for (let i = 1; i < element.points.length; i++) {
                    ctx.lineTo(element.points[i][0], element.points[i][1]);
                }
                ctx.stroke();
                break;
            }
        }
    }

    // --- EVENT HANDLERS ---
    
    function getPosition(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left - viewState.panX * viewState.scale) / viewState.scale,
            y: (clientY - rect.top - viewState.panY * viewState.scale) / viewState.scale
        };
    }

    // --- MOUSE & SINGLE-TOUCH ---
    function start(e) {
        // Handle touch events
        if (e.touches) {
            if (e.touches.length === 2) { // START PINCH
                isPinching = true;
                isDrawing = false;
                isPanning = false;
                initialPinchDistance = getTouchDistance(e.touches[0], e.touches[1]);
                return;
            }
            // Use only the first touch for drawing/panning
            e = e.touches[0]; 
        }

        if (currentTool === 'drag') {
            isPanning = true;
            canvas.classList.add('panning');
            lastPanPoint = { x: e.clientX, y: e.clientY };
            return;
        }

        isDrawing = true;
        canvas.classList.add('drawing');
        const pos = getPosition({ clientX: e.clientX, clientY: e.clientY });

        currentElement = {
            type: currentTool,
            color: currentColor,
            width: currentBrushSize,
            points: [[pos.x, pos.y]]
        };
        
        if (currentTool !== 'draw') {
             currentElement.points.push([pos.x, pos.y]);
        }
    }

    function move(e) {
        // Handle touch events
        if (e.touches) {
            if (isPinching && e.touches.length === 2) { // HANDLE PINCH
                handlePinchZoom(e);
                return;
            }
            // Use only the first touch for drawing/panning
            e = e.touches[0];
        }

        updateCoordinates({ clientX: e.clientX, clientY: e.clientY });

        if (isPanning) {
            const dx = (e.clientX - lastPanPoint.x) / viewState.scale;
            const dy = (e.clientY - lastPanPoint.y) / viewState.scale;
            viewState.panX += dx;
            viewState.panY += dy;
            lastPanPoint = { x: e.clientX, y: e.clientY };
            redrawCanvas();
            return;
        }

        if (!isDrawing) return;

        const pos = getPosition({ clientX: e.clientX, clientY: e.clientY });
        if (currentTool === 'draw') {
            currentElement.points.push([pos.x, pos.y]);
        } else {
            currentElement.points[1] = [pos.x, pos.y];
        }
        redrawCanvas();
    }
    
    function end(e) {
        // If a touch ends, check if we should stop pinching
        if (e.touches && e.touches.length < 2) {
             isPinching = false;
        }

        if (isPanning) {
            isPanning = false;
            canvas.classList.remove('panning');
        }
        if (isDrawing) {
            isDrawing = false;
            canvas.classList.remove('drawing');
            if (currentElement && currentElement.points.length > 1) {
                // For shapes, ensure the two points are not the same
                if (currentTool === 'draw' || (currentElement.points[0][0] !== currentElement.points[1][0] || currentElement.points[0][1] !== currentElement.points[1][1])) {
                    drawingState.elements.push(currentElement);
                }
            }
            currentElement = null;
        }
    }
    
    // --- PINCH & WHEEL ZOOM ---
    function handlePinchZoom(e) {
        const newDist = getTouchDistance(e.touches[0], e.touches[1]);
        const scaleMultiplier = newDist / initialPinchDistance;
        
        const midpoint = getMidpoint(e.touches[0], e.touches[1]);
        zoomAtPoint(midpoint.x, midpoint.y, scaleMultiplier);

        initialPinchDistance = newDist; // Update for continuous zoom
    }
    
    function handleWheelZoom(e) {
        e.preventDefault();
        const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1; // Zoom out or in
        zoomAtPoint(e.clientX, e.clientY, scaleAmount);
    }
    
    function zoomAtPoint(clientX, clientY, scaleMultiplier) {
        const rect = canvas.getBoundingClientRect();
        
        // Find the world coordinates of the mouse pointer
        const worldX = (clientX - rect.left - viewState.panX * viewState.scale) / viewState.scale;
        const worldY = (clientY - rect.top - viewState.panY * viewState.scale) / viewState.scale;
        
        // Update the scale
        const oldScale = viewState.scale;
        viewState.scale *= scaleMultiplier;
        viewState.scale = Math.max(0.1, Math.min(viewState.scale, 20)); // Clamp scale
        
        // Adjust pan so the world point under the mouse stays in the same screen spot
        viewState.panX = ((clientX - rect.left) / viewState.scale) - worldX;
        viewState.panY = ((clientY - rect.top) / viewState.scale) - worldY;

        redrawCanvas();
        updateCoordinates({ clientX, clientY });
    }

    // --- UI & OTHER ---
    function updateCoordinates(e) {
         if (e && e.clientX && e.clientY) {
            const pos = getPosition(e);
            coordinates.textContent = `X: ${Math.round(pos.x)}, Y: ${Math.round(pos.y)} | Scale: ${viewState.scale.toFixed(2)}`;
        }
    }

    function zoom(direction) {
        const scaleAmount = direction === 'in' ? 1.2 : 0.8;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        zoomAtPoint(centerX + canvas.getBoundingClientRect().left, centerY + canvas.getBoundingClientRect().top, scaleAmount);
    }

    function resetView() {
        viewState.scale = 1;
        viewState.panX = 0;
        viewState.panY = 0;
        redrawCanvas();
        updateCoordinates(); // Update display with reset values
    }
    
    function setActiveTool(tool) {
        currentTool = tool;
        document.querySelectorAll('.tool-button').forEach(btn => btn.classList.remove('active'));
        if(tool !== 'drag'){
            document.getElementById(`${tool}Btn`).classList.add('active');
            canvas.style.cursor = 'crosshair';
        } else {
             document.getElementById('dragBtn').classList.add('active');
             canvas.style.cursor = 'grab';
        }
    }

    // --- INITIALIZATION & EVENT LISTENERS ---
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse Events
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', end);
    canvas.addEventListener('mouseleave', end);
    
    // Touch Events
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', end);
    canvas.addEventListener('touchcancel', end);
    
    // Zoom & Pan Events
    container.addEventListener('wheel', handleWheelZoom, { passive: false });
    container.addEventListener('mousemove', (e) => updateCoordinates(e));

    // --- TOOLBAR LISTENERS ---
    
    // Tools
    document.getElementById('dragBtn').addEventListener('click', () => setActiveTool('drag'));
    document.getElementById('drawBtn').addEventListener('click', () => setActiveTool('draw'));
    document.getElementById('rectangleBtn').addEventListener('click', () => setActiveTool('rectangle'));
    document.getElementById('circleBtn').addEventListener('click', () => setActiveTool('circle'));
    document.getElementById('triangleBtn').addEventListener('click', () => setActiveTool('triangle'));
    document.getElementById('trapeziumBtn').addEventListener('click', () => setActiveTool('trapezium'));
    document.getElementById('lineBtn').addEventListener('click', () => setActiveTool('line'));

    // Brush & Color
    document.getElementById('brushSize').addEventListener('input', e => currentBrushSize = e.target.value);
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', e => {
            currentColor = e.target.dataset.color;
            document.querySelector('.color-option.active').classList.remove('active');
            e.target.classList.add('active');
        });
    });

    // Actions
    document.getElementById('clearBtn').addEventListener('click', () => {
        drawingState.elements = [];
        redrawCanvas();
    });
    document.getElementById('fullscreenBtn').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    });

    // Zoom Controls
    document.getElementById('zoomIn').addEventListener('click', () => zoom('in'));
    document.getElementById('zoomOut').addEventListener('click', () => zoom('out'));
    document.getElementById('resetView').addEventListener('click', resetView);
    
    // Themes
    const themes = ['dark', 'light', 'cosmic', 'retro', 'maximalist'];
    themes.forEach(theme => {
        const themeId = `theme${theme.charAt(0).toUpperCase() + theme.slice(1)}`;
        document.getElementById(themeId).addEventListener('click', () => {
            document.body.className = `${theme}-theme`;
            document.querySelector('.theme-button.active').classList.remove('active');
            document.getElementById(themeId).classList.add('active');
        });
    });

    // Dropdowns
    let activeDropdown = null;
    function toggleDropdown(dropdown) {
        if (activeDropdown && activeDropdown !== dropdown) {
            activeDropdown.classList.remove('active');
        }
        dropdown.classList.toggle('active');
        activeDropdown = dropdown.classList.contains('active') ? dropdown : null;
    }
    document.getElementById('shapesDropdownBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown(document.getElementById('shapesDropdown'));
    });
    document.getElementById('themesDropdownBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown(document.getElementById('themesDropdown'));
    });
    window.addEventListener('click', () => {
        if (activeDropdown) {
            activeDropdown.classList.remove('active');
            activeDropdown = null;
        }
    });
});