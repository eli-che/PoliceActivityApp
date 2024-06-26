﻿// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
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
    //if web page url is /stationer then fetch police stations
    if (window.location.pathname === "/stationer") {
        fetchPoliceStations();
    }


    // Attach the change event listener to the date picker
    $('#datepicker').on('change', function () {
        var selectedDate = $(this).val();
        console.log('Date selected:', selectedDate);
        if (selectedDate) {
            fetchEventsByDate(selectedDate);
        }
    });

    function fetchPoliceStations() {
        var url = '/Stationer/GetPoliceStations';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Data received:', data);
                updateStationMap(data);
                updateStationSidebar(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function fetchEventsByDate(date) {
        var url = `/PoliceActivity/GetEventsByDate?date=${date}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Data received:', data);
                updateEventMap(data);
                updateEventSidebar(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function getRegionFromUrl(url) {
        // Extract the part of the URL after '/polisstationer/'
        const parts = url.split('/polisstationer/');
        if (parts.length > 1) {
            // Extract the part after '/polisstationer/' and split by '/'
            const regionPart = parts[1].split('/')[0];
            return regionPart;
        }
        return null;
    }


    function updateStationMap(stations) {
        const selectedCategories = getSelectedStationCategories().split(';').map(decodeURIComponent);
        console.log('Selected categories:', selectedCategories);

        // Clear map data
        if (map) {
            // Clear the existing map if it already exists
            map.remove();
        }

        map = L.map('map').setView([59.3293, 18.0686], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // icon URL should be car-crash.png inside pictures folder

        stations.forEach(function (station) {
            const region = getRegionFromUrl(station.Url);
            if (!region || !selectedCategories.includes(region)) {
                return;
            }

            const coords = station.location.gps.split(',');

            const marker = L.marker([parseFloat(coords[0]), parseFloat(coords[1])]).addTo(map);

            marker.bindPopup(`<b>${station.name}</b><br>${station.location.name}`);
            marker.on('click', function () {
                updateStationDetails(station);
            });
        });
 
    }
    function updateStationSidebar(stations) {
        const selectedCategories = getSelectedStationCategories().split(';').map(decodeURIComponent);
        console.log('Selected categories:', selectedCategories);
        var sidebarDetails = $('#station-details');
        var stationTable = $('#station-table tbody');
        sidebarDetails.empty();
        stationTable.empty();

        sidebarDetails.append('<h5>Placeholder</h5>');
        sidebarDetails.append('<p>Placeholder</p>');
        sidebarDetails.append('<p>Placeholder</p>');

        stations.forEach(function (station) {
            const region = getRegionFromUrl(station.Url);
            if (!region || !selectedCategories.includes(region)) {
                return;
            }

            var servicesList = $('<ul></ul>');
            station.services.forEach(function (service) {
                servicesList.append(`<li>${service.name}</li>`);
            });

            var stationRow = `
    <tr>
        <td><a href="${station.Url}">${station.location.name}</a></td>
        <td>${servicesList.prop('outerHTML')}</td>
    </tr>`;
            stationTable.append(stationRow);
        });

        // Add first station's details in the sidebar
        updateStationDetails(stations[0]);
    }

    function updateStationDetails(station) {
        var sidebarDetails = $('#station-details');
        sidebarDetails.empty();
        sidebarDetails.append(`<h5>${station.name}</h5>`);
        sidebarDetails.append(`<p><strong>Adress:</strong> ${station.location.name}</p>`);
        sidebarDetails.append(`<p><strong>Tjänster:</strong></p>`);

        var servicesList = $('<ul></ul>');
        station.services.forEach(function (service) {
            servicesList.append(`<li>${service.name}</li>`);
        });
        sidebarDetails.append(servicesList);
        sidebarDetails.append(`<p><strong>Länk:</strong> <a href="${station.Url}">${station.Url}</a></p>`);
    }

    function updateEventMap(events) {
        let selectedCategories = getSelectedCategories().split(';').map(decodeURIComponent);
        console.log('Selected categories:', selectedCategories);

        // Clear map data
        if (map) {
            // Clear the existing map if it already exists
            map.remove();
        }
        map = L.map('map').setView([59.3293, 18.0686], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Car crash png test
        let customIcon = L.icon({
            iconUrl: "/Pictures/car-crash.png",
            iconSize: [40, 40]
        });

        // icon url should be car-crash.png inside pictures folder

        events.forEach(function (event) {
            if (!selectedCategories.includes(event.type)) {
                return;
            }

            var coords = event.location.gps.split(',');
            // if event is "Trafikolycka" then use "car-crash.png" as icon
            if (event.type === "Trafikolycka") {
                var marker = L.marker([parseFloat(coords[0]), parseFloat(coords[1])], {
                    icon: customIcon
                }).addTo(map);
            } else {
                var marker = L.marker([parseFloat(coords[0]), parseFloat(coords[1])]).addTo(map);
            }
            marker.bindPopup(`<b>${event.name}</b><br>${event.summary}`);
            marker.on('click', function () {
                updateEventDetails(event);
            });
        });
    }

    function updateEventSidebar(events) {
        let selectedCategories = getSelectedCategories().split(';').map(decodeURIComponent);
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
            if (!selectedCategories.includes(event.type)) {
                return;
            }
            var eventUrl = event.url.startsWith('/') ? event.url : '/' + event.url;
            var eventRow = `
        <tr>
            <td>${event.name}</td>
            <td><a href="https://polisen.se${eventUrl}">${event.summary}</a></td>
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

    $('.policestation-checkbox').on('change', function () {
        if (!$(this).is('#allCategories')) {
            $('#allCategories').prop('checked', false);
        }
        fetchPoliceStations();
    });

    $('#allCategories').on('change', function () {
        var isChecked = $(this).is(':checked');
        $('.form-check-input').prop('checked', isChecked);
        var selectedDate = $('#datepicker').val();
       // fetchEventsByDate(selectedDate);
    });

    $('.policeevent').on('change', function () {
        if (!$(this).is('#allCategories')) {
            $('#allCategories').prop('checked', false);
        }
        var selectedDate = $('#datepicker').val();
        fetchEventsByDate(selectedDate);
    });

    function getSelectedStationCategories() {
        let selectedCategories = [];
        let checkboxes = document.querySelectorAll('.form-check-input');
        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked && !checkbox.id.startsWith('allCategories')) {
                selectedCategories.push(encodeURIComponent(checkbox.id));
            }
        });
        return selectedCategories.join(';');
    }
    function getSelectedCategories() {
        let selectedCategories = [];
        let checkboxes = document.querySelectorAll('.form-check-input');
        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked && !checkbox.id.startsWith('allCategories')) {
                let label = document.querySelector(`label[for=${checkbox.id}]`).innerText;
                selectedCategories.push(encodeURIComponent(label));
            }
        });
        return selectedCategories.join(';');
    }
});
