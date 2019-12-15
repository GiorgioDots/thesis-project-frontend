import Vue from 'vue'

const dateFilter = value => {
    return formatDate(value);
};

function formatDate(inputDate) {
    const date = new Date(inputDate);
    return date.toLocaleString();
}

Vue.filter('date', dateFilter)
