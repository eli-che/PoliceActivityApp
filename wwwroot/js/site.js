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
        var url = `/PoliceActivity/GetEventsByDate?date=${date}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Data received:', data);
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
            marker.on('click', function () {
                updateEventDetails(event);
            });
        });
    }

    function updateSidebar(events) {
        var sidebarDetails = $('#event-details');
        var latestNews = $('#latest-news');
        var eventTable = $('#event-table tbody');
        sidebarDetails.empty();
        latestNews.empty();
        eventTable.empty();

        sidebarDetails.append('<h5>PlaceHolder</h5>');
        sidebarDetails.append('<p>PlaceHolder</p>');

        events.forEach(function (event) {
            var newsItem = `<li class="list-group-item">${event.name}</li>`;
            latestNews.append(newsItem);
        });

        events.forEach(function (event) {
            var eventRow = `<tr>
                <td>${event.name}</td>
                <td>${event.summary}</td>
            </tr>`;
            eventTable.append(eventRow);
        });

        //Lägg till första eventet i detaljerna
        updateEventDetails(events[0]);
    }

    function updateEventDetails(event) {
        var sidebarDetails = $('#event-details');
        sidebarDetails.empty();
        sidebarDetails.append(`<h5>${event.name}</h5>`);
        sidebarDetails.append(`<p><strong>Händelse:</strong> ${event.summary}</p>`);
        sidebarDetails.append(`<p><strong>Länk:</strong> <a href="https://polisen.se${event.url}">https://polisen.se${event.url}</a</p>`);
    }


    $('#allCategories').on('change', function () {
        var isChecked = $(this).is(':checked');
        $('.form-check-input').prop('checked', isChecked);
        // Kategori filter logik
    });
});
