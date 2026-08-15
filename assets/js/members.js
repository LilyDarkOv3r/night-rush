const defaultMemberDetails = {
  name: "Greta Ponywolf",
  image: "assets/images/members/gretaponywolf.png",
  role: "",
  memberSince: "",
  responsible: "",
  book: "",
  show: "",
  nickname: "",
  zodiac: "",
  age: "",
  instagram: "",
  spotify: "",
  quote: "",
};

const membersPage = document.querySelector(".members-page");
const membersList = document.querySelector("#members-list");
let profiles = [];
let activeProfile = null;

const backdrop = document.createElement("button");
backdrop.className = "member-menu-backdrop";
backdrop.type = "button";
backdrop.setAttribute("aria-label", "Profil bez\u00e1r\u00e1sa");

const menu = document.createElement("aside");
menu.className = "member-menu";
menu.setAttribute("aria-hidden", "true");
menu.innerHTML = `
  <button class="member-menu-close" type="button" aria-label="Profil bez\u00e1r\u00e1sa">x</button>
  <div class="member-menu-image-wrap">
    <img class="member-menu-image" src="" alt="">
    <div class="member-menu-nickname" data-field="nickname"></div>
    <div class="member-menu-sign">
      <div class="member-menu-meta">
        <span data-field="zodiac"></span>
        <span aria-hidden="true">|</span>
        <strong data-field="age"></strong>
      </div>
      <div class="member-menu-socials" aria-label="Social linkek">
        <a data-field="instagram" href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram megnyit\u00e1sa">
          <img src="assets/images/icons/instagram.png" alt="">
        </a>
        <a data-field="spotify" href="#" target="_blank" rel="noopener noreferrer" aria-label="Spotify megnyit\u00e1sa">
          <img src="assets/images/icons/spotify.png" alt="">
        </a>
      </div>
    </div>
  </div>
  <div class="member-menu-copy">
    <h3></h3>
    <p class="member-menu-role"></p>
    <dl>
      <div>
        <dt>Csatlakozás dátuma:</dt>
        <dd data-field="memberSince"></dd>
      </div>
      <div>
        <dt>Feladatok:</dt>
        <dd data-field="responsible"></dd>
      </div>
      <div>
        <dt>Kedvenc könyv:</dt>
        <dd data-field="book"></dd>
      </div>
      <div>
        <dt>Kedvenc film/sorozat:</dt>
        <dd data-field="show"></dd>
      </div>
    </dl>
    <blockquote></blockquote>
  </div>
`;

document.body.append(backdrop, menu);

const closeButton = menu.querySelector(".member-menu-close");
const menuImage = menu.querySelector(".member-menu-image");
const menuTitle = menu.querySelector(".member-menu-copy h3");
const menuRole = menu.querySelector(".member-menu-role");
const menuQuote = menu.querySelector("blockquote");
const menuNickname = menu.querySelector('[data-field="nickname"]');
const menuZodiac = menu.querySelector('[data-field="zodiac"]');
const menuAge = menu.querySelector('[data-field="age"]');
const menuMeta = menu.querySelector(".member-menu-meta");
const menuInstagram = menu.querySelector('[data-field="instagram"]');
const menuSpotify = menu.querySelector('[data-field="spotify"]');
const menuSocials = menu.querySelector(".member-menu-socials");

const normalizeMember = (member = {}) => ({
  ...defaultMemberDetails,
  ...member,
});

const hasValue = (value) => {
  if (value === null || value === undefined) return false;
  const text = String(value).trim();
  return text !== "" && text !== "-";
};

const setText = (element, value, wrapper = element) => {
  const shouldShow = hasValue(value);
  element.textContent = shouldShow ? value : "";
  wrapper.hidden = !shouldShow;
  return shouldShow;
};

const setDataRow = (field, value) => {
  const element = menu.querySelector(`[data-field="${field}"]`);
  setText(element, value, element.closest("div"));
};

const setSocialLink = (element, value) => {
  const shouldShow = hasValue(value);
  element.href = shouldShow ? value : "#";
  element.hidden = !shouldShow;
  return shouldShow;
};

const getProfileDetails = (profile) => normalizeMember(profile.memberDetails);

const openMenu = (profile) => {
  activeProfile = profile;
  const details = getProfileDetails(profile);

  profiles.forEach((item) => item.classList.toggle("is-active", item === profile));
  membersPage?.classList.add("has-open-profile");
  document.body.classList.add("member-menu-open");

  menuImage.src = details.image;
  menuImage.alt = `${details.name} portreja`;
  menuTitle.textContent = details.name;
  setText(menuRole, hasValue(details.role) ? `- ${details.role}` : "", menuRole);
  setDataRow("memberSince", details.memberSince);
  setDataRow("responsible", details.responsible);
  setDataRow("book", details.book);
  setDataRow("show", details.show);
  setText(menuNickname, details.nickname, menuNickname);
  const hasZodiac = setText(menuZodiac, details.zodiac, menuZodiac);
  const hasAge = setText(menuAge, details.age, menuAge);
  menuMeta.hidden = !hasZodiac && !hasAge;
  menuMeta.classList.toggle("has-one-item", hasZodiac !== hasAge);
  const hasInstagram = setSocialLink(menuInstagram, details.instagram);
  const hasSpotify = setSocialLink(menuSpotify, details.spotify);
  menuSocials.hidden = !hasInstagram && !hasSpotify;
  setText(menuQuote, details.quote, menuQuote);

  menu.setAttribute("aria-hidden", "false");
};

function closeMenu() {
  activeProfile = null;
  profiles.forEach((profile) => profile.classList.remove("is-active"));
  membersPage?.classList.remove("has-open-profile");
  document.body.classList.remove("member-menu-open");
  menu.setAttribute("aria-hidden", "true");
}

const createMemberProfile = (member) => {
  const details = normalizeMember(member);
  const profile = document.createElement("article");
  profile.className = "member-profile";
  profile.tabIndex = 0;
  profile.setAttribute("role", "button");
  profile.setAttribute("aria-label", `${details.name} profilja`);
  profile.memberDetails = details;

  const image = document.createElement("img");
  image.src = details.image;
  image.alt = `${details.name} portr\u00e9ja`;

  const name = document.createElement("h3");
  name.textContent = details.name;

  profile.append(image, name);
  return profile;
};

const renderMembers = (data) => {
  membersList.replaceChildren();

  data.ranks.forEach((rank) => {
    const rankSection = document.createElement("section");
    rankSection.className = "rank-section";
    rankSection.setAttribute("aria-labelledby", `rank-${rank.id}`);

    const title = document.createElement("h2");
    title.id = `rank-${rank.id}`;
    title.textContent = rank.title;

    const grid = document.createElement("div");
    grid.className = `member-grid${rank.members.length === 1 ? " single" : ""}`;

    rank.members.forEach((member) => {
      grid.append(createMemberProfile(member));
    });

    rankSection.append(title, grid);
    membersList.append(rankSection);
  });

  profiles = Array.from(document.querySelectorAll(".member-profile"));
  bindProfileEvents();
};

const bindProfileEvents = () => {
  profiles.forEach((profile) => {
    profile.addEventListener("click", () => {
      openMenu(profile);
    });

    profile.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openMenu(profile);
      }
    });
  });
};

const loadMembers = async () => {
  try {
    const response = await fetch("assets/data/members.json");
    if (!response.ok) {
      throw new Error("assets/data/members.json could not be loaded");
    }
    const data = await response.json();
    renderMembers(data);
  } catch (error) {
    if (window.NIGHT_RUSH_MEMBERS) {
      renderMembers(window.NIGHT_RUSH_MEMBERS);
      return;
    }

    membersList.innerHTML = '<p class="members-error">A taglista most nem el\u00e9rhet\u0151.</p>';
  }
};

backdrop.addEventListener("click", closeMenu);
closeButton.addEventListener("click", closeMenu);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

loadMembers();
