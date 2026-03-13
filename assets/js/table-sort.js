document.addEventListener("DOMContentLoaded", function () {
    const tables = document.querySelectorAll("table");

    tables.forEach(table => {
        const headers = table.querySelectorAll("th");

        // 排序核心函数
        function sortTable(table, index, isAsc) {
            const rows = Array.from(table.querySelectorAll("tbody tr"));
            rows.sort((a, b) => {
                const aText = a.querySelectorAll("td")[index].textContent.trim();
                const bText = b.querySelectorAll("td")[index].textContent.trim();

                if (!isNaN(aText) && !isNaN(bText)) {
                    return isAsc ? aText - bText : bText - aText;
                }
                return isAsc
                    ? aText.localeCompare(bText, "zh-CN")
                    : bText.localeCompare(aText, "zh-CN");
            });

            const tbody = table.querySelector("tbody") || table;
            rows.forEach(row => tbody.appendChild(row));
        }

        // 点击排序（修复版）
        headers.forEach((th, index) => {
            th.addEventListener("click", () => {
                const currentIsDesc = th.classList.contains("desc");
                const newIsAsc = currentIsDesc;

                // 清除所有列的排序状态
                headers.forEach(h => {
                    h.classList.remove("asc", "desc");
                });

                // 设置当前列新状态
                th.classList.add(newIsAsc ? "asc" : "desc");

                // 执行排序
                sortTable(table, index, newIsAsc);
            });
        });

        // ✅ 默认：第一列降序
        if (headers.length > 0) {
            headers[0].classList.add("desc");
            sortTable(table, 0, false);
        }
    });
});