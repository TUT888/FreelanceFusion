// Part 1: Set up global variables
const socket = io();
let currentProjectId = "";
let currentJobId = "";

// Handle task drag-and-drop logic with Socket.io


// Part 2: Set up functions

function reinitializeSortable() {
    todoList = new Sortable(document.getElementById('todo-list'), {
        group: 'tasks',
        animation: 150,
        swapThreshold: 0.2,
        onEnd: handleTaskMove
    });

    inProgressList = new Sortable(document.getElementById('in-progress-list'), {
        group: 'tasks',
        animation: 150,
        swapThreshold: 0.2,
        onEnd: handleTaskMove
    });

    completedList = new Sortable(document.getElementById('completed-list'), {
        group: 'tasks',
        animation: 150,
        swapThreshold: 0.2,
        onEnd: handleTaskMove
    });
}

// Create a task HTML element
function createTaskElement(task) {
    const taskElement = document.createElement('li');
    taskElement.classList.add('task');
    taskElement.setAttribute('data-id', task._id);
    taskElement.setAttribute('data-position', task.position);
    taskElement.textContent = task.title; // Display task title
    return taskElement;
}

function createCandidateElement(candidate, template = 1) {
    let candidateHTML="";
    switch (template) {
        case 1:
            candidateHTML = `
                <li class="candidate" data-id="${candidate._id}">
                    <div class="candidate-info">
                        <span class="candidate-name">${candidate.freelancer_info.profile.name}</span>
                        <p class="candidate-skills">Skills: ${candidate.freelancer_info.profile.skills.join(', ')}</p>
                        <p class="candidate-skills">Description: ${candidate.cover_letter}</p>
                    </div>
                    <div class="candidate-actions">
                        <button class="btn hire-btn" data-freelancer-id="${candidate._id}">Hire</button>
                        <button class="btn chat-btn" data-freelancer-id="${candidate._id}">Chat</button>
                    </div>
                </li>
            `;
            break;
    
        case 2:
            candidateHTML = `
            <li class="candidate" data-id="${candidate._id}">
                <div class="candidate-info">
                    <span class="candidate-name">${candidate.freelancer_info.profile.name}</span>
                    <p class="candidate-skills">Skills: ${candidate.freelancer_info.profile.skills.join(', ')}</p>
                    <p class="candidate-skills">Description: ${candidate.cover_letter}</p>
                </div>
                <div class="candidate-actions">
                    <button class="btn chat-btn" data-freelancer-id="${candidate._id}">Chat</button>
                </div>
            </li>
        `;
            break;
    }

    
    // Convert the HTML string to an actual DOM element and return it
    const candidateElement = document.createElement('div');
    candidateElement.innerHTML = candidateHTML.trim();
    
    return candidateElement.firstChild;  // Return the newly created element
}




// Load tasks for a specific project
async function loadTasks(projectId) {
    currentProjectId = projectId;
    const response = await fetch(`/projects/${currentProjectId}/tasks`);
    const tasks = await response.json();

    clearTaskLists(); // Clear existing tasks
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        document.getElementById(`${task.progress}-list`).appendChild(taskElement);
    });
    reinitializeSortable()
}

async function loadCandidate(projectId) {
    clearCandidateLists();
    currentProjectId = projectId;
    const response = await fetch(`/projects/${currentProjectId}/candidate`);
    const candidate = await response.json();

    const candidateElement = createCandidateElement(candidate[0], 2);
    document.getElementById('candidate_container').appendChild(candidateElement);

}

// Load candidates for a specific project
async function loadCandidates(jobId) {
    clearCandidateLists();
    currentJobId = jobId;
    const response =  await fetch(`/projects/${currentJobId}/candidates`);
    const candidates = await response.json();

    candidates.forEach(candidate => {
        const candidateElement = createCandidateElement(candidate);
        document.getElementById('candidate_container').appendChild(candidateElement);
    });
}

// Clear task lists before loading new tasks
function clearTaskLists() {
    document.getElementById('todo-list').innerHTML = '';
    document.getElementById('in-progress-list').innerHTML = '';
    document.getElementById('completed-list').innerHTML = '';
}
function clearCandidateLists() {
    document.getElementById('candidate_container').innerHTML = '';
}

function createTask(task) {
    socket.emit('create-task', { ...task, currentProjectId });
}


function handleTaskMove(evt) {
    const taskId = evt.item.getAttribute('data-id');
    const newStatus = evt.to.id.replace('-list', '');

    const prevTask = evt.item.previousElementSibling ? evt.item.previousElementSibling.getAttribute('data-id') : null;
    const nextTask = evt.item.nextElementSibling ? evt.item.nextElementSibling.getAttribute('data-id') : null;
    let newPosition;

    if (prevTask && nextTask) {
        const prevPosition = parseFloat(evt.item.previousElementSibling.getAttribute('data-position'));  // Use parseFloat for decimal values
        const nextPosition = parseFloat(evt.item.nextElementSibling.getAttribute('data-position'));

        // Average the positions of the previous and next tasks
        newPosition = (prevPosition + nextPosition) / 2;  // Decimal position
    } else if (prevTask) {
        const prevPosition = parseFloat(evt.item.previousElementSibling.getAttribute('data-position'));
        newPosition = prevPosition + 100000;  // Use large step to avoid frequent updates
    } else if (nextTask) {
        const nextPosition = parseFloat(evt.item.nextElementSibling.getAttribute('data-position'));
        newPosition = nextPosition - 100000;
    } else {
        // If no previous or next task, assign an initial position
        newPosition = 100000;
    }

    // Update the task status in the database
    updateTaskStatus(taskId, newStatus, newPosition);
}

// Update task status in the database
async function updateTaskStatus(taskId, newStatus, newPosition) {
    await fetch(`/projects/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, status: newStatus, position: newPosition })
    });
}

async function hireFreelancer(freelancer_id, job_id) {
    await fetch(`/projects/create`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job_id, freelancerId: freelancer_id })
    });
}

async function getJobDetail(jobId) {
    // Make an AJAX request to fetch the rendered partial
    await  fetch(`/jobs/search/${jobId}`)
        .then(response => response.text()) // Return the response as HTML
        .then(html => {
            console.log(html)
            // Update the job details section with the rendered partial
            document.getElementById('project_info_container').innerHTML = html;
        })
        .catch(error => {
            console.error(error)
        });
}



//Part 3: Set up socket event
// Listen for task updates from the server
socket.on('task-update', function (data) {
    const { taskId, status, position } = data;

    // Find the task element by its data-id attribute
    const taskElement = document.querySelector(`[data-id='${taskId}']`);

    if (taskElement) {
        // Update the task's data-position attribute with the new position
        taskElement.setAttribute('data-position', position);

        // Get the target list (To-do, In Progress, Completed) based on the new status
        const targetList = document.getElementById(`${status}-list`);

        // Find the correct place in the target list based on newPosition
        let inserted = false;
        const tasks = targetList.children;

        for (let i = 0; i < tasks.length; i++) {
            const currentTaskPosition = parseFloat(tasks[i].getAttribute('data-position'));

            // If the current task's position is greater than the new position, insert before it
            if (currentTaskPosition > position) {
                targetList.insertBefore(taskElement, tasks[i]);
                inserted = true;
                break;
            }
        }

        // If not inserted in the middle, append it at the end
        if (!inserted) {
            targetList.appendChild(taskElement);
        }
    }
});

// Listen for task creation and updates
socket.on('new-task', function (task) {
    if (task.project_id === currentProjectId) {
        const taskElement = createTaskElement(task);
        document.getElementById(`${task.progress}-list`).appendChild(taskElement);
    }
});

//Part 4: Set up Event

document.addEventListener('DOMContentLoaded', function () {
    let userRole = document.getElementById('project_container').getAttribute('data-id');
    const firstProjectItem = document.querySelector('.job-item');
    if (firstProjectItem) {
        const firstJobId = firstProjectItem.getAttribute('data-job-id');

        const firstProjectId = firstProjectItem.getAttribute('data-project-id');
        if (firstProjectId) {
            loadTasks(firstProjectId)
            if (userRole == "client") {
                loadCandidate(firstJobId)
            }else{
                getJobDetail(firstJobId)
            }
        }else{
            if (userRole == "client") {
                loadCandidates(firstJobId)
            }else{
                getJobDetail(firstJobId)
            }

        }
    }

    // Tabs
    var el = document.querySelector('.tabs');
    var instance = M.Tabs.init(el, {});

    // Initialize Materialize select dropdowns
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);

    var jobListElement = document.getElementById('job-list');

    // When a job item is clicked, update the job details on the right
    document.querySelectorAll('.job-item').forEach(function (item) {
        item.addEventListener('click', function () {
            var jobId = item.getAttribute('data-job-id');
            var projectId = item.getAttribute('data-project-id');
            var projectName = item.getAttribute('data-project-name');
            document.getElementById('project_name').innerHTML = projectName;
            if (projectId != "") {
                loadTasks(projectId)
                if (userRole == "client") {
                    loadCandidate(jobId)
                }else{
                    getJobDetail(jobId)
                }
            } else {
                if (userRole == "client") {
                    loadCandidates(jobId)
                }else{
                    getJobDetail(jobId)
                }

                // Make an AJAX request to fetch the rendered partial
                fetch(`/projects/new`)
                    .then(response => response.text()) // Return the response as HTML
                    .then(html => {
                        // Update the job details section with the rendered partial
                        document.getElementById('job-details').innerHTML = html;
                        var el = document.querySelector('.tabs');
                        var instance = M.Tabs.init(el, {});
                    })
                    .catch(error => {
                        console.error(error)
                    });

            }
            // Set the clicked job as active
            document.querySelectorAll('.job-item').forEach(function (el) {
                el.classList.remove('active');
            });
            item.classList.add('active');
        });
    });


});

