// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.,
console.log('site.js is loaded');
var map;
$(document).ready(function () {
    console.log('Document is ready');

    // Set the default date to today's date
    var today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    $('#datepicker').val(today);

    fetchEventsByDate(today);

    // Attach the change event listener to the date picker
    $('#datepicker').on('change', function () {
        var selectedDate = $(this).val();
        console.log('Date selected:', selectedDate);
        if (selectedDate) {
            fetchEventsByDate(selectedDate);
        }
    });

    function fetchEventsByDate(date) {
        var url = `https://polisen.se/api/events?DateTime=${date}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Data received:', data); // Debugging statement
                updateMap(data);
                updateSidebar(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function updateMap(events) {
        //Clear map data
        if (map) {
            // Clear the existing map if it already exists
            map.remove();
        }
        map = L.map('map').setView([59.3293, 18.0686], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        events.forEach(function (event) {
            var coords = event.location.gps.split(',');
            var marker = L.marker([parseFloat(coords[0]), parseFloat(coords[1])]).addTo(map);
            marker.bindPopup(`<b>${event.name}</b><br>${event.summary}`);
        });
    }

    function updateSidebar(events) {
        var sidebar = $('.right-sidebar');
        sidebar.empty();
        events.forEach(function (event) {
            var eventItem = `<div>
                <h5>${event.type} i ${event.location.name}</h5>
                <p>${event.summary}</p>
                <p><strong>Inträffade:</strong> ${event.datetime}</p>
            </div>`;
            sidebar.append(eventItem);
        });
    }

    $('#allCategories').on('change', function () {
        var isChecked = $(this).is(':checked');
        $('.form-check-input').prop('checked', isChecked);
        // Kategori filter logik
    });
});
