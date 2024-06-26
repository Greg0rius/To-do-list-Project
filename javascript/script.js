const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const selectPrioritas = document.getElementById("select-prioritas");
const afterList = document.getElementById("after-list");

const tanggalSekarang = new Date();
const ambilFormat = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
});

const bagian = ambilFormat.formatToParts(tanggalSekarang);
const formatTanggal = bagian.map(({ type, value }) => {
    switch (type) {
        case "day":
        case "month":
        case "year":
            return value;
        case "weekday":
            return value + ",";
        case "hour":
            return "(" + value + " :";
        case "minute":
            return value + ")";
        default:
            return "";
    }
}).join(" ");

function tambahkan() {
    if (selectPrioritas.value === "" || inputBox.value === "") {
        alert("Belum memasukkan teks atau belum memilih prioritas");
    } else {
        let frame41 = document.createElement("div");
        frame41.classList.add("frame-41");
        frame41.id = "list";
        listContainer.appendChild(frame41);

        let namaTugas = document.createElement("div");
        namaTugas.classList.add("nama-tugas");
        frame41.appendChild(namaTugas);

        let chekBox = document.createElement("span");
        chekBox.classList.add("chek-box");
        namaTugas.appendChild(chekBox);

        let isi = document.createElement("div");
        isi.classList.add("isi");
        isi.innerHTML = inputBox.value;
        namaTugas.appendChild(isi);

        let waktu = document.createElement("div");
        waktu.classList.add("tenggat");
        waktu.innerHTML = formatTanggal;
        frame41.appendChild(waktu);

        let prioritas = document.createElement("div");
        prioritas.classList.add("prioritas");
        prioritas.innerHTML = selectPrioritas.value
        frame41.appendChild(prioritas);

        let kosong = document.createElement("div");
        kosong.classList.add("kosong");
        frame41.appendChild(kosong);

        let hapus = document.createElement("span");
        hapus.id = "hapus";
        hapus.classList.add("hapus");
        kosong.appendChild(hapus);

        simpan();
    }

    inputBox.value = "";
    selectPrioritas.value = "";
}

let frame41Clones = new Map(); 

function addRemoveListener(clone) {
    clone.addEventListener('click', function (event) {
        if (event.target.classList.contains("hapus")) {
            let frame41Element = event.target.closest('.frame-41');

            if (frame41Element) {
                let konfirmasi = confirm("Apakah Anda yakin ingin menghapus item ini?");
                if (konfirmasi) {
                    frame41Element.remove();
                    frame41Clones.forEach((value, key) => {
                        if (value === frame41Element) {
                            frame41Clones.delete(key);
                        }
                    });
                    simpan();
                }
            }
        }
    });
}

listContainer.addEventListener("click", function (i) {
    if (i.target.tagName === "SPAN" && i.target.classList.contains('chek-box')) {
        let frame41 = i.target.closest('.frame-41');

        if (frame41) {
            frame41.classList.toggle('chaked');
            i.target.classList.toggle('conteng');

            let frame6Element = document.querySelector('.frame-6');

            if (frame6Element) {
                if (frame41.classList.contains('chaked')) {
                    if (!frame41Clones.has(frame41)) {
                        let frame41Clone = frame41.cloneNode(true);

                        frame41Clone.classList.remove('chaked');
                        frame41Clone.querySelectorAll('.chek-box').forEach(function (checkBox) {
                            checkBox.remove();
                        });

                        let tanggalElement = frame41Clone.querySelector('.tenggat');
                        if (tanggalElement) {
                            tanggalElement.textContent = formatTanggal;
                        }

                        addRemoveListener(frame41Clone);

                        frame6Element.appendChild(frame41Clone);

                        frame41Clones.set(frame41, frame41Clone);

                        simpan();
                    }
                } else {
                    if (frame41Clones.has(frame41)) {
                        let frame41Clone = frame41Clones.get(frame41);
                        frame41Clone.remove();
                        frame41Clones.delete(frame41);
                        simpan();
                    }
                }
            }
        }
    } else if (i.target.classList.contains("hapus")) {
        let frame41Element = i.target.closest('.frame-41');

        if (frame41Element) {
            let konfirmasi = confirm("Apakah Anda yakin ingin menghapus item ini?");
            if (konfirmasi) {
                frame41Element.remove();

                if (frame41Clones.has(frame41Element)) {
                    let frame41Clone = frame41Clones.get(frame41Element);
                    frame41Clone.remove();
                    frame41Clones.delete(frame41Element);
                    simpan();
                } else {
                    frame41Clones.forEach((value, key) => {
                        if (value === frame41Element) {
                            frame41Clones.delete(key);
                            simpan();
                        }
                    });
                }
            }
        }
    }
}, false);

document.getElementById('hapus-semua').addEventListener('click', function () {
    let konfirmasi = confirm("Apakah Anda yakin ingin menghapus semua item?");
    if (konfirmasi) {
        document.querySelectorAll('.frame-41').forEach(function (frame41) {
            frame41.remove();
        });

        frame41Clones.forEach(function (clone) {
            clone.remove();
        });

        frame41Clones.clear();

        simpan();
    }
});

function simpan() {
    localStorage.setItem("listContainer", listContainer.innerHTML);
    localStorage.setItem("afterList", afterList.innerHTML);
}

function tampilkan() {
    listContainer.innerHTML = localStorage.getItem("listContainer") || "";
    afterList.innerHTML = localStorage.getItem("afterList") || "";
}

tampilkan();
