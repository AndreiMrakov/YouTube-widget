window.onload = () => {
    //************ create new tag with classname func *************
    let createNewTag = (newTagName, ...newTagClassNames) => {
        let newTag = document.createElement(newTagName);
        if (newTagClassNames.length > 0) {
            newTagClassNames.forEach(newTagClassName => newTag.classList.add(newTagClassName));
        }
        return newTag;
    };
    //************ saving api key for google services ***************
    const API_KEY = 'AIzaSyD-2Q0k4jdD8fpVJpZw6umra3uv7wxv0mc';
    //************ getting main container ***************
    let mainContainer = document.getElementById('dynamic-container');
    //************** creating array for response elements *************
    let searchArchiveData = [];
    //************* getting input element form DOM ***************
    let searchInput = document.getElementById('search-input');
    //******************selecting send ajax button ****************
    let submitBtn = document.getElementById('submit-btn');
    //***************** creating var for search input value *********
    let searchValue;
    //***************** creating modal window *********
    let modalContainer = createNewTag('div', 'modal-container');

    //************ change value of search **********************
    let changeValue = (e) => {
        searchValue = e.target.value;
    };

    //************ creating each search result **********************
    let createSearchItem = (obj) => {
        let appendCarousel = (parent, ...childElems) => childElems.forEach(child => parent.appendChild(child));
        let creatingNewModal = (videoUrl) => {
            modalContainer.classList.add('active');
            document.body.classList.add('no-scroll');
            let closeIframeBtn = createNewTag('span', 'close-popup-btn');
            modalContainer.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoUrl}?&autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            closeIframeBtn.addEventListener('click', () => {
                document.body.classList.remove('no-scroll');
                modalContainer.classList.remove('active');
                modalContainer.innerHTML = '';
            });
            modalContainer.addEventListener('click', () => {
                document.body.classList.remove('no-scroll');
                modalContainer.classList.remove('active');
                modalContainer.innerHTML = '';
            });
            modalContainer.appendChild(closeIframeBtn);
            mainContainer.appendChild(modalContainer);
        };

        let searchItemContainer = createNewTag('div', 'search-item-container');
        let searchItemIconContainer = createNewTag('div', 'search-item-icon-container');
        let searchItemIcon = createNewTag('img', 'search-item-icon');
        let searchItemTextContainer = createNewTag('div', 'search-item-text-container');
        let searchItemTitle = createNewTag('p', 'search-item-title');
        let searchItemChannelTitle = createNewTag('a', 'search-item-channel-title');
        let searchItemDate = createNewTag('p', 'search-item-date');
        let searchItemDescription = createNewTag('p', 'search-item-description');
        // ****************** rendering search result *****************
        searchItemIcon.src = obj.snippet.thumbnails.high.url;
        searchItemTitle.textContent = obj.snippet.title;
        searchItemChannelTitle.href = `https://www.youtube.com/channel/${obj.snippet.channelId}`;
        searchItemChannelTitle.textContent = obj.snippet.channelTitle;
        searchItemDate.textContent = obj.snippet.publishedAt.slice(0, 19);
        searchItemDescription.textContent = obj.snippet.description;

        // ****************** appending all components to main container *****************
        searchItemIconContainer.appendChild(searchItemIcon);
        appendCarousel(searchItemTextContainer, searchItemTitle, searchItemChannelTitle, searchItemDate, searchItemDescription);
        appendCarousel(searchItemContainer, searchItemIconContainer, searchItemTextContainer);

        searchItemIcon.addEventListener('click', () => {
            creatingNewModal(obj.id.videoId)
        });
        searchItemTextContainer.addEventListener('mouseenter', () => {
            searchItemIconContainer.innerHTML = `<iframe width="360" height="240" src="https://www.youtube.com/embed/${obj.id.videoId}?rel=0&autoplay=1&mute=1&showinfo=0&controls=0" frameborder="0"></iframe>`;
        });
        searchItemTextContainer.addEventListener('mouseleave', () => {
            searchItemIconContainer.innerHTML = '';
            searchItemIconContainer.appendChild(searchItemIcon);
        });
        return searchItemContainer;
    };

    // ****************** rendering search result *****************
    let showAllSearchResults = () => {
        searchArchiveData.forEach(searchItem => {
            mainContainer.appendChild(createSearchItem(searchItem));
        })
    };

    // ****************** sending ajax request func *****************
    let getNewAjax = () => {
        let searchResult = 10;
        let req = new XMLHttpRequest();
        req.onload = () => {
            searchArchiveData = req.response.items;
            console.clear();
            console.log(searchArchiveData);
            showAllSearchResults();
        };
        req.open('GET', `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${API_KEY}&q=${searchValue}&type=video&maxResults=${searchResult}`);
        req.responseType = 'json';
        req.send();
    };

    //******************* adding events ******************
    submitBtn.addEventListener('click', getNewAjax);
    searchInput.addEventListener('input', changeValue);
};