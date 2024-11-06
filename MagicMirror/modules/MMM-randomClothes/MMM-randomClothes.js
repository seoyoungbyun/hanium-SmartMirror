Module.register("MMM-randomClothes", {
    defaults: {
        updateInterval: 60000, // 자동 갱신 간격
    },

    start: function() {
        this.clothesData = null; // 초기 상태
        this.bottomClothes = null;
        this.hashUpdated = false;
    },

    getRandomBottomClothes: function(clothesArray) {
        if (!clothesArray) return null;
        if (clothesArray.length === 0) return null; // 하의가 없으면 null 반환
        const randomIndex = Math.floor(Math.random() * clothesArray.length); // 랜덤 인덱스
        return clothesArray[randomIndex]; // 선택된 하의 반환
    },

    getDom: function() {
        const wrapper = document.createElement("div");

        // 옷 버튼 추가
        const buttonClothes = document.createElement("button");
        buttonClothes.innerHTML = "코디";
        buttonClothes.style.fontSize = "20px";
        buttonClothes.style.padding = "20px 30px";
        buttonClothes.style.backgroundColor = "#4CAF50"; // 초록색 버튼
        buttonClothes.style.color = "white";
        buttonClothes.style.border = "none";
        buttonClothes.style.borderRadius = "5px";
        buttonClothes.style.cursor = "pointer";
        buttonClothes.style.position = "fixed";
        buttonClothes.style.bottom = "50px";
        buttonClothes.style.right = "40px";
        buttonClothes.style.zIndex = "9999";

        buttonClothes.onclick = () => {
            this.sendSocketNotification("FETCH_RANDOM_CLOTHES");
        };
        wrapper.appendChild(buttonClothes);

        // 저장 버튼 추가
        const buttonSave = document.createElement("button");
        buttonSave.innerHTML = "저장";
        buttonSave.style.fontSize = "20px";
        buttonSave.style.padding = "20px 30px";
        buttonSave.style.backgroundColor = "#FFA500"; // 주황색 버튼
        buttonSave.style.color = "white";
        buttonSave.style.border = "none";
        buttonSave.style.borderRadius = "5px";
        buttonSave.style.cursor = "pointer";
        buttonSave.style.position = "fixed";
        buttonSave.style.bottom = "50px";
        buttonSave.style.right = "150px"; // 옷 버튼 왼쪽에 배치
        buttonSave.style.zIndex = "9999";

        // 저장 버튼 클릭 이벤트
        buttonSave.onclick = () => {
            if (this.clothesData) {
                topClothes = this.clothesData.find(c => c.type === 0);
                // const bottomClothes = this.clothesData.find(c => c.type === 1);
                bottomClothes = this.bottomClothes?this.bottomClothes:this.clothesData.find(c => c.type === 1);

                if (topClothes && bottomClothes) {
                    const codyData = {
                        user_id: topClothes.user_id, // type 0인 옷의 user_id를 사용
                        top_id: topClothes.clothes_id,
                        bottom_id: bottomClothes.clothes_id,
                        top_color: topClothes.color,
                        top_img: topClothes.image,  // top 이미지
                        bottom_img: bottomClothes.image // bottom 이미지
                    };
                    this.sendSocketNotification("SAVE_CODY", codyData); // 서버로 코디 데이터 전송
                    this.updateDom();
                } else {
                    console.error("Top or Bottom clothes not found.");
                }
            }
            else{
                console.log("no data");
            }
        };
        wrapper.appendChild(buttonSave);

        // 옷 정보가 있으면 화면에 출력
        if (this.clothesData) {
            const clothesWrapper = document.createElement("div");
            clothesWrapper.style.display = "block"; // 이미지들이 세로로 쌓이도록 설정

            // type 0인 옷과 type 1인 옷을 각각 하나씩만 출력
            topClothes = this.clothesData.find(c => c.type === 0);
            // const bottomClothes = this.clothesData.find(c => c.type === 1);
            this.sendSocketNotification("RUN_PYTHON_SCRIPT", topClothes);
            bottomClothes = this.bottomClothes?this.bottomClothes:this.clothesData.find(c => c.type === 1);

            if (topClothes) {
                const topWrapper = document.createElement("div");

                const imgTop = document.createElement("img");
                imgTop.src = `data:image/png;base64,${topClothes.image}`;
                imgTop.alt = "Top Clothes";
                imgTop.style.width = "150px";
                imgTop.style.height = "auto";
                imgTop.style.marginTop = "40px";
                topWrapper.appendChild(imgTop);

                clothesWrapper.appendChild(topWrapper);
            }

            if (bottomClothes) {
                const bottomWrapper = document.createElement("div");

                const imgBottom = document.createElement("img");
                imgBottom.src = `data:image/png;base64,${bottomClothes.image}`;
                imgBottom.alt = "Bottom Clothes";
                imgBottom.style.width = "170px";
                imgBottom.style.height = "auto";
                imgBottom.style.marginBottom = "60px";
                bottomWrapper.appendChild(imgBottom);

                clothesWrapper.appendChild(bottomWrapper);
            }

            wrapper.appendChild(clothesWrapper);
        }

        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "RANDOM_CLOTHES_RESULT") {
            this.clothesData = payload;
            this.updateDom();  // 화면 갱신
            this.hashUpdated = true;  // 데이터가 업데이트 되었음을 표시
            this.updateDom();  // 화면 갱신
            
        }
        
        if(notification === "BOTTOM_CLOTHES_RESULT"){
            console.log(JSON.stringify(payload, null, 2));
            const newBottomClothes = this.getRandomBottomClothes(payload);
            
            if (JSON.stringify(this.bottomClothes) !== JSON.stringify(newBottomClothes)) {
                this.bottomClothes = newBottomClothes;
                this.hasUpdated = true;  // 상태가 변경되었음을 표시
            }
            
            // 상태가 변경되었을 때만 업데이트
            if (this.hasUpdated) {
                console.log(JSON.stringify(this.bottomClothes, null, 2));
                this.updateDom();
                this.hasUpdated = false; // 업데이트 후 플래그 초기화
            }
        }
    }
});