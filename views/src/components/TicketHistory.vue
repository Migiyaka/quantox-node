<template>
    <div class="ticket-history">
        <table class="table is-fullwidth is-bordered">
            <thead>
                <tr>
                    <th class="has-text-centered">Revision</th>
                    <th class="has-text-centered">Action</th>
                    <th class="has-text-centered">Value</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="historyItem in historyItems">
                    <td class="has-text-centered">{{ historyItem.revision }}</td>
                    <td class="has-text-centered">{{ historyItem.revision === 1 ? 'Created' : 'Updated' }}</td>
                    <td class="has-text-centered" v-html="parseHistoryValue(historyItem)"></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        props: {
            historyItems: {
                type: Array,
                defaultValue: [],
            },
        },
        computed: {
            statusList() {
                return this.$store.getters['status/getList'];
            },
            userList() {
                return this.$store.getters['user/getList'];
            },
        },
        methods: {
            parseHistoryValue(historyItem) {
                let parsedValue;

                if (!historyItem.change) {
                    parsedValue = JSON.parse(historyItem.document);
                } else {
                    parsedValue = historyItem.change;
                }

                const status = this.findItemById('status', parsedValue.statusId);
                const creator = this.findItemById('user', parsedValue.creatorId);
                const assignee = this.findItemById('user', parsedValue.assigneeId);

                let html = '';

                html += parsedValue.title ? `<b>Title:</b> ${parsedValue.title}<br>` : '';
                html += parsedValue.content ? `<b>Content:</b> ${parsedValue.content}<br>` : '';

                html += parsedValue.statusId ?
                    `<b>Status:</b> ${status ? status.text : `[ID: ${parsedValue.statusId}]`}<br>` : '';

                html += parsedValue.creatorId ?
                    `<b>Creator:</b> ${creator ? creator.username : `[ID: ${parsedValue.creatorId}]`}<br>` : '';

                html += parsedValue.assigneeId ?
                    `<b>Assignee:</b> ${assignee ? assignee.username : `[ID: ${parsedValue.assigneeId}]`}<br>` : '';

                html = html.substring(0, html.length - 2);

                return html;
            },
            findItemById(type, id) {
                return this[`${type}List`].find(item => item.id === id);
            },
        },
    };
</script>
