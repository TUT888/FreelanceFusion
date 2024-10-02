// Part 1: Set up global variables
const projectSocket = io();
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
    if (candidate != undefined) {
        switch (template) {
            case 1:
                candidateHTML = `
                    <li class="candidate" data-id="${candidate.freelancer_id}">
                        <div class="candidate-info">
                            <span class="candidate-name">${candidate.freelancer_info.profile.name}</span>
                            <p class="candidate-skills">Skills: ${candidate.freelancer_info.profile.skills.join(', ')}</p>
                            <p class="candidate-skills">Description: ${candidate.cover_letter}</p>
                        </div>
                        <div class="candidate-actions">
                            <button class="btn hire-btn" data-freelancer-id="${candidate.freelancer_id}">Hire</button>
                            <button class="btn chat-btn" data-freelancer-id="${candidate.freelancer_id}">Chat</button>
                        </div>
                    </li>
                `;
                break;
        
            case 2:
                candidateHTML = `
                <li class="candidate" data-id="${candidate.freelancer_id}">
                    <div class="candidate-info">
                        <span class="candidate-name">${candidate.freelancer_info.profile.name}</span>
                        <p class="candidate-skills">Skills: ${candidate.freelancer_info.profile.skills.join(', ')}</p>
                        <p class="candidate-skills">Description: ${candidate.cover_letter}</p>
                    </div>
                    <div class="candidate-actions">
                        <button class="btn delete-btn" data-freelancer-id="${candidate.freelancer_id}">Remove</button>
                        <button class="btn chat-btn" data-freelancer-id="${candidate.freelancer_id}">Chat</button>
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

async function loadCandidate(jobId) {
    clearCandidateLists();
    currentJobId = jobId;
    const response = await fetch(`/projects/${currentJobId}/candidate`);
    const candidate = await response.json();

    if (candidate[0] != undefined) {
        updateData(jobId, candidate[0].project_info._id)
        const candidateElement = createCandidateElement(candidate[0], 2);
        document.getElementById('candidate_container').appendChild(candidateElement);
    }
    attachButtonListeners();


}

// Load candidates for a specific project
async function loadCandidates(jobId) {
    clearCandidateLists();
    currentJobId = jobId;
    const response =  await fetch(`/projects/${currentJobId}/candidates`);
    const candidates = await response.json();
    updateData(jobId, "")

    candidates.forEach(candidate => {
        const candidateElement = createCandidateElement(candidate);
        document.getElementById('candidate_container').appendChild(candidateElement);
    });
    attachButtonListeners();

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
    projectSocket.emit('create-task', { ...task, currentProjectId });
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

function updateData(id, newdata){
    if (newdata) {
        currentProjectId = newdata;

    }else{
        currentProjectId = '';

    }
    const elem = document.getElementById(id);
    elem.setAttribute('data-project-id', newdata);
}

//Part 3: Set up socket event
// Listen for task updates from the server
projectSocket.on('task-update', function (data) {
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
projectSocket.on('new-task', function (task) {
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

    // Initialize all modals on the page
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

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
                        loadCandidate(jobId);
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

// Function to attach the event listeners for hire and delete buttons
// Function to attach the event listeners for hire and delete buttons
function attachButtonListeners() {
    const hireBtns = document.querySelectorAll('.hire-btn');
    const deleteBtns = document.querySelectorAll('.delete-btn');

    hireBtns.forEach(hireBtn => {
        const existingListener = hireBtn.dataset.listener; // Check if a listener has already been added
        if (!existingListener) {
            hireBtn.addEventListener('click', function handleHireClick() {
                const freelancerId = hireBtn.getAttribute('data-freelancer-id');
                const jobId = currentJobId;

                // Send the freelancer_id and job_id to the backend
                fetch(`/projects/create/${jobId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ freelancerId, jobId })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Freelancer hired successfully!');
                        loadCandidate(jobId); // Reload the candidate list
                    } else {
                        alert('Error hiring freelancer: ' + data.error);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            });

            hireBtn.dataset.listener = true; // Mark that a listener has been added
        }
    });

    deleteBtns.forEach(deleteBtn => {
        const existingListener = deleteBtn.dataset.listener; // Check if a listener has already been added
        if (!existingListener) {
            deleteBtn.addEventListener('click', function handleDeleteClick() {
                const projectId = currentProjectId;

                // Confirm before deleting
                if (confirm('Are you sure you want to delete this project?')) {
                    // Send DELETE request to the backend
                    fetch(`/projects/${projectId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert('Project deleted successfully!');
                            const listItem = document.getElementById(currentJobId);
                            listItem.removeAttribute('data-project-id');
                            loadCandidates(currentJobId); // Reload the candidate list
                        } else {
                            alert('Error deleting project: ' + data.error);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                }
            });

            deleteBtn.dataset.listener = true; // Mark that a listener has been added
        }
    });
}

document.getElementById('add-task-btn').addEventListener('click', function () {
    const modal = document.getElementById('task-creation-modal');
    const instance = M.Modal.getInstance(modal);
    instance.open();
});


document.getElementById('create-task-btn').addEventListener('click', async function () {
    const taskTitle = document.getElementById('new-task-title').value;
    const taskContent = document.getElementById('new-task-content').value;
    const totalTasks = document.querySelectorAll('#todo-list .task').length;
    const newPosition = (totalTasks + 1) * 100000; 

    if (taskTitle.trim() !== '') {
        const taskData = {
            title: taskTitle,
            content: taskContent,
            progress: 'todo', // Defaulting to 'todo' list
            position: newPosition,
            projectId: currentProjectId // Using the current project ID
        };

        // Send the new task to the backend
        const response = await fetch(`/projects/${currentProjectId}/tasks/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        
        const result = await response.json();
        if (result.success) {
            // Append the new task to the list
            const newTaskElement = createTaskElement(result.task);
            document.getElementById('todo-list').appendChild(newTaskElement);
            reinitializeSortable();
        } else {
            alert('Error creating task: ' + result.error);
        }
    } else {
        alert('Please enter a valid task title.');
    }
});
