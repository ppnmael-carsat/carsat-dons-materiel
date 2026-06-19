  // identifiants pour se connecter a jsonbin, la ou est stocke l'historique en ligne
  const BIN_ID = '6a1ff733da38895dfe80091d';
  const API_KEY = '$2a$10$Aqjox6i/Kjlt8yH.9I7YDe259lUuDEsz8D4IXl65o55Tz5RdOn6GG';
  const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;


  // variables utilisees dans toute l'appli
  let equipements = [];
  let historique = [];


  // synchro avec jsonbin (chargement et sauvegarde de l'historique en ligne)

  async function chargerHistorique() {
    setSyncStatus('load');
    try {
      const res = await fetch(BIN_URL + '/latest', { headers: { 'X-Master-Key': API_KEY } });
      const data = await res.json();
      historique = data.record.historique || [];
      setSyncStatus('ok');
    } catch(e) {
      setSyncStatus('err');
      showToast('Erreur de connexion', true);
    }
  }

  async function sauvegarderHistorique() {
    setSyncStatus('load');
    try {
      await fetch(BIN_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
        body: JSON.stringify({ historique })
      });
      setSyncStatus('ok');
    } catch(e) {
      setSyncStatus('err');
      showToast('Erreur de sauvegarde', true);
    }
  }

  function setSyncStatus(status) {
    const el = document.getElementById('sync-status');
    if (status === 'ok') { el.className = 'sync-status sync-ok'; el.textContent = 'Synchronisé'; }
    else if (status === 'err') { el.className = 'sync-status sync-err'; el.textContent = 'Hors ligne'; }
    else { el.className = 'sync-status sync-load'; el.textContent = 'Sync...'; }
  }


  // navigation entre les onglets saisie / historique / sauvegarde

  function switchTab(tab, el) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    el.classList.add('active');
    if (tab === 'historique') renderHistorique();
  }


  // le bloc "details composants" reste ouvert ou ferme tout seul
  // (comportement natif du navigateur, pas besoin de faire quoi que ce soit ici)
  function toggleDetails(id) {}


  // affiche le bon bloc de champs selon le type d'equipement choisi

  function updateFields() {
    const type = document.getElementById('type').value;
    // on cache tous les blocs avant d'afficher le bon
    ['fields-pc', 'fields-tour', 'fields-ecran', 'fields-periph'].forEach(id => {
      document.getElementById(id).classList.remove('visible');
    });
    if (type === 'PC Portable')              document.getElementById('fields-pc').classList.add('visible');
    else if (type === 'Tour')                document.getElementById('fields-tour').classList.add('visible');
    else if (type === 'Écran')               document.getElementById('fields-ecran').classList.add('visible');
    else if (type === 'Clavier' || type === 'Souris') document.getElementById('fields-periph').classList.add('visible');
  }


  // ajoute un equipement a la liste en cours

  function ajouterEquipement() {
    const type = document.getElementById('type').value;
    if (!type) { showToast('Sélectionnez un type !', true); return; }

    let item = { type };

    if (type === 'PC Portable') {
      // si "Autre" est choisi dans le menu, on prend le texte tape a la place
      const selectModele = document.getElementById('modele').value;
      item.modele = selectModele === 'Autre'
        ? document.getElementById('modele-autre').value.trim()
        : selectModele;
      item.ref = document.getElementById('ref').value.trim();
      item.sn = document.getElementById('sn').value.trim();
      if (!item.modele || !item.ref || !item.sn) { showToast('Remplissez tous les champs !', true); return; }
      item.formate = document.getElementById('formate').value;
      item.etat = document.getElementById('etat').value;
      const exportComposants = document.getElementById('export-composants').checked;
      item.ram = exportComposants ? (document.getElementById('ram').checked ? 'Oui' : 'Non') : '—';
      item.disque = exportComposants ? (document.getElementById('disque').checked ? 'Oui' : 'Non') : '—';
      item.commentaire = document.getElementById('commentaire').value.trim();
      item.qty = 1;
      document.getElementById('ref').value = '';
      document.getElementById('sn').value = '';
      document.getElementById('commentaire').value = '';
      document.getElementById('ram').checked = true;
      document.getElementById('disque').checked = true;
      document.getElementById('export-composants').checked = true;
      document.getElementById('sn').focus();

    } else if (type === 'Tour') {
      // si "Autre" est choisi dans le menu, on prend le texte tape a la place
      const selectModele = document.getElementById('modele-tour').value;
      item.modele = selectModele === 'Autre'
        ? document.getElementById('modele-tour-autre').value.trim()
        : selectModele;
      item.ref = document.getElementById('ref-tour').value.trim();
      item.sn = document.getElementById('sn-tour').value.trim();
      if (!item.modele || !item.ref || !item.sn) { showToast('Remplissez tous les champs !', true); return; }
      item.formate = document.getElementById('formate-tour').value;
      item.etat = document.getElementById('etat-tour').value;
      const exportComposantsTour = document.getElementById('export-composants-tour').checked;
      item.ram = exportComposantsTour ? (document.getElementById('ram-tour').checked ? 'Oui' : 'Non') : '—';
      item.disque = exportComposantsTour ? (document.getElementById('disque-tour').checked ? 'Oui' : 'Non') : '—';
      item.commentaire = document.getElementById('commentaire-tour').value.trim();
      item.qty = 1;
      document.getElementById('ref-tour').value = '';
      document.getElementById('sn-tour').value = '';
      document.getElementById('commentaire-tour').value = '';
      document.getElementById('ram-tour').checked = true;
      document.getElementById('disque-tour').checked = true;
      document.getElementById('export-composants-tour').checked = true;
      document.getElementById('sn-tour').focus();

    } else if (type === 'Écran') {
      const selectModele = document.getElementById('modele-ecran').value;
      item.modele = selectModele === 'Autre'
        ? document.getElementById('modele-ecran-autre').value.trim()
        : selectModele;
      item.ref = document.getElementById('ref-ecran').value.trim();
      if (!item.modele) { showToast('Remplissez le modèle !', true); return; }
      item.etat = document.getElementById('etat-ecran').value;
      item.commentaire = document.getElementById('commentaire-ecran').value.trim();
      item.qty = 1;
      document.getElementById('ref-ecran').value = '';
      document.getElementById('commentaire-ecran').value = '';
      document.getElementById('ref-ecran').focus();

    } else {
      // cas clavier / souris
      item.modele = document.getElementById('modele-periph').value.trim() || '—';
      item.qty = parseInt(document.getElementById('qty-periph').value) || 1;
      item.etat = document.getElementById('etat-periph').value;
      item.commentaire = document.getElementById('commentaire-periph').value.trim();
      document.getElementById('qty-periph').value = '1';
      document.getElementById('commentaire-periph').value = '';
    }

    equipements.push(item);
    renderListe();
    showToast('Équipement ajouté !');
    document.getElementById('btn-export').disabled = false;
  }

  function supprimerEquipement(index) {
    equipements.splice(index, 1);
    renderListe();
    if (equipements.length === 0) document.getElementById('btn-export').disabled = true;
  }

  function renderListe() {
    const container = document.getElementById('liste-container');
    const total = equipements.reduce((s, e) => s + (e.qty || 1), 0);
    document.getElementById('count').textContent = total;

    if (equipements.length === 0) {
      container.innerHTML = `<div class="list-empty"><div class="icon"></div><p>Aucun équipement ajouté.<br>Commencez par remplir le formulaire.</p></div>`;
      return;
    }

    const badges = { 'PC Portable': 'badge-pc', 'Tour': 'badge-pc', 'Écran': 'badge-ecran', 'Clavier': 'badge-clavier', 'Souris': 'badge-souris' };

    let html = '<ul class="item-list">';
    equipements.forEach((e, i) => {
      const sub = [e.ref, e.sn].filter(Boolean).join(' · ');
      const tags = [];
      if (e.formate) tags.push(e.formate === 'Non' ? '<span style="color:#c0392b;font-size:10px;font-family:\'DM Mono\',monospace">Non formaté</span>' : '<span style="color:#2d7a4f;font-size:10px;font-family:\'DM Mono\',monospace">Formaté</span>');
      if (e.etat) tags.push(e.etat === 'Non' ? '<span style="color:#c0392b;font-size:10px;font-family:\'DM Mono\',monospace">Mauvais état</span>' : '<span style="color:#2d7a4f;font-size:10px;font-family:\'DM Mono\',monospace">Bon état</span>');

      html += `<li class="item">
        <span class="item-badge ${badges[e.type] || 'badge-pc'}">${e.type}</span>
        <div class="item-info">
          <div class="item-title">${e.modele || '—'}</div>
          ${sub ? `<div class="item-sub">${sub}</div>` : ''}
          ${tags.length ? `<div style="display:flex;gap:8px;margin-top:3px">${tags.join('')}</div>` : ''}
          ${e.commentaire ? `<div class="item-sub" style="font-style:italic;color:#8a9ab0">${e.commentaire}</div>` : ''}
        </div>
        ${e.qty > 1 ? `<span class="item-qty">x${e.qty}</span>` : ''}
        <button class="btn-del" onclick="supprimerEquipement(${i})" title="Supprimer">×</button>
      </li>`;
    });
    html += '</ul>';
    container.innerHTML = html;
  }


  // generation du fichier excel

  function esc(v) { return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // un nom de feuille excel ne peut pas contenir / \ ? * [ ] :
  // et doit faire 31 caracteres max, donc on nettoie le nom de la pile
  // et on evite les doublons en ajoutant (2), (3) etc si besoin
  function nomFeuilleExcelUnique(label, nomsDejaUtilises) {
    let nom = String(label || 'Feuille')
      .replace(/[\/\\\?\*\[\]:]/g, '-')
      .trim()
      .substring(0, 31) || 'Feuille';

    let nomFinal = nom;
    let compteur = 2;
    while (nomsDejaUtilises.has(nomFinal)) {
      const suffixe = ` (${compteur})`;
      nomFinal = nom.substring(0, 31 - suffixe.length) + suffixe;
      compteur++;
    }
    nomsDejaUtilises.add(nomFinal);
    return nomFinal;
  }


  function buildDataRows(equipements) {
    const ordre = ['PC Portable', 'Tour', 'Écran', 'Clavier', 'Souris'];
    let expanded = [];
    equipements.forEach(e => { for (let q = 0; q < (e.qty||1); q++) expanded.push(e); });
    const sorted = expanded.sort((a, b) => ordre.indexOf(a.type) - ordre.indexOf(b.type));

    let rows = '';
    sorted.forEach((e, i) => {
      const styleType = 'sType' + e.type.replace(/\s/g,'').replace('É','E').replace('é','e');
      const styleData = i%2===0 ? 'sDataA' : 'sDataB';
      rows += `<Row ss:Height="18">
        <Cell ss:StyleID="${styleType}"><Data ss:Type="String">${esc(e.type)}</Data></Cell>
        <Cell ss:StyleID="${styleData}"><Data ss:Type="String">${esc(e.modele)}</Data></Cell>
        <Cell ss:StyleID="${styleData}"><Data ss:Type="String">${esc(e.ref)}</Data></Cell>
        <Cell ss:StyleID="${styleData}"><Data ss:Type="String">${esc(e.sn)}</Data></Cell>
        <Cell ss:StyleID="${styleData}"><Data ss:Type="String">${esc(e.formate)}</Data></Cell>
        <Cell ss:StyleID="${styleData}"><Data ss:Type="String">${esc(e.etat)}</Data></Cell>
        <Cell ss:StyleID="${styleData}"><Data ss:Type="String">${esc(e.ram)}</Data></Cell>
        <Cell ss:StyleID="${styleData}"><Data ss:Type="String">${esc(e.disque)}</Data></Cell>
        <Cell ss:StyleID="${styleData}"><Data ss:Type="String">${esc(e.commentaire||'')}</Data></Cell>
      </Row>`;
    });
    return { rows, nb: sorted.length };
  }

  function buildWorkbook(sheets) {
    const styles = `<Styles>
  <Style ss:ID="sTitre"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:Bold="1" ss:Size="14" ss:Color="#FFFFFF" ss:FontName="Calibri"/><Interior ss:Color="#1A2E4A" ss:Pattern="Solid"/></Style>
  <Style ss:ID="sSousTitre"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:Italic="1" ss:Size="10" ss:Color="#FFFFFF" ss:FontName="Calibri"/><Interior ss:Color="#2D4F7C" ss:Pattern="Solid"/></Style>
  <Style ss:ID="sHeader"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:Bold="1" ss:Size="11" ss:Color="#FFFFFF" ss:FontName="Calibri"/><Interior ss:Color="#1A2E4A" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#E8A020"/></Borders></Style>
  <Style ss:ID="sDataA"><Alignment ss:Vertical="Center"/><Font ss:Size="10" ss:FontName="Calibri"/><Interior ss:Color="#F4F1EB" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4CFC6"/></Borders></Style>
  <Style ss:ID="sDataB"><Alignment ss:Vertical="Center"/><Font ss:Size="10" ss:FontName="Calibri"/><Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4CFC6"/></Borders></Style>
  <Style ss:ID="sTypePCPortable"><Alignment ss:Vertical="Center"/><Font ss:Bold="1" ss:Size="10" ss:Color="#1A4A7C" ss:FontName="Calibri"/><Interior ss:Color="#DCEAF7" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4CFC6"/></Borders></Style>
  <Style ss:ID="sTypeTour"><Alignment ss:Vertical="Center"/><Font ss:Bold="1" ss:Size="10" ss:Color="#1A4A7C" ss:FontName="Calibri"/><Interior ss:Color="#DCEAF7" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4CFC6"/></Borders></Style>
  <Style ss:ID="sTypeEcran"><Alignment ss:Vertical="Center"/><Font ss:Bold="1" ss:Size="10" ss:Color="#1A5C38" ss:FontName="Calibri"/><Interior ss:Color="#D4EEDD" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4CFC6"/></Borders></Style>
  <Style ss:ID="sTypeClavier"><Alignment ss:Vertical="Center"/><Font ss:Bold="1" ss:Size="10" ss:Color="#7C4A00" ss:FontName="Calibri"/><Interior ss:Color="#FDE8C8" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4CFC6"/></Borders></Style>
  <Style ss:ID="sTypeSouris"><Alignment ss:Vertical="Center"/><Font ss:Bold="1" ss:Size="10" ss:Color="#5C1A7C" ss:FontName="Calibri"/><Interior ss:Color="#F0D8F5" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4CFC6"/></Borders></Style>
  <Style ss:ID="sGroupe"><Alignment ss:Horizontal="Left" ss:Vertical="Center"/><Font ss:Bold="1" ss:Size="11" ss:Color="#FFFFFF" ss:FontName="Calibri"/><Interior ss:Color="#E8A020" ss:Pattern="Solid"/></Style>
  </Styles>`;

    let worksheets = '';
    const nomsDejaUtilises = new Set();
    sheets.forEach(s => {
      const nomFeuille = nomFeuilleExcelUnique(s.label, nomsDejaUtilises);
      worksheets += `<Worksheet ss:Name="${esc(nomFeuille)}"><Table ss:DefaultColumnWidth="80">
  <Column ss:Width="110"/><Column ss:Width="180"/><Column ss:Width="130"/><Column ss:Width="130"/><Column ss:Width="80"/><Column ss:Width="80"/><Column ss:Width="80"/><Column ss:Width="100"/><Column ss:Width="200"/>
  <Row ss:Height="30"><Cell ss:MergeAcross="8" ss:StyleID="sTitre"><Data ss:Type="String">CARSAT Normandie — Liste des Dons Matériel</Data></Cell></Row>
  <Row ss:Height="18"><Cell ss:MergeAcross="8" ss:StyleID="sSousTitre"><Data ss:Type="String">Date d'export : ${s.date}     |     Total : ${s.nb} équipement(s)</Data></Cell></Row>
  <Row ss:Height="6"/>
  <Row ss:Height="22">
    <Cell ss:StyleID="sHeader"><Data ss:Type="String">Type</Data></Cell>
    <Cell ss:StyleID="sHeader"><Data ss:Type="String">Modèle</Data></Cell>
    <Cell ss:StyleID="sHeader"><Data ss:Type="String">N° d'inventaire</Data></Cell>
    <Cell ss:StyleID="sHeader"><Data ss:Type="String">N° de Série (S/N)</Data></Cell>
    <Cell ss:StyleID="sHeader"><Data ss:Type="String">Formaté</Data></Cell>
    <Cell ss:StyleID="sHeader"><Data ss:Type="String">Bon état</Data></Cell>
    <Cell ss:StyleID="sHeader"><Data ss:Type="String">RAM</Data></Cell>
    <Cell ss:StyleID="sHeader"><Data ss:Type="String">Disque dur</Data></Cell>
    <Cell ss:StyleID="sHeader"><Data ss:Type="String">Commentaire</Data></Cell>
  </Row>
  ${s.rows}
  </Table></Worksheet>`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?>
  <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel">
  ${styles}${worksheets}</Workbook>`;
  }

  function telechargerXML(xml, filename) {
    const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  // au moment d'exporter, on demande un nom de pile (avec une proposition par defaut)
  // pour pouvoir s'y retrouver plus tard dans l'historique

  function exporterExcel() {
    if (equipements.length === 0) return;

    const now = new Date();
    const heure = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');
    const dateAffichage = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    const total = equipements.reduce((s, e) => s + (e.qty || 1), 0);
    const nomParDefaut = `Pile du ${dateAffichage} ${heure} - ${total} PC`;

    document.getElementById('modal-pile-input').value = nomParDefaut;
    document.getElementById('modal-pile-overlay').classList.add('show');
    document.getElementById('modal-pile-input').focus();
    document.getElementById('modal-pile-input').select();
  }

  function fermerModalPile() {
    document.getElementById('modal-pile-overlay').classList.remove('show');
  }

  async function confirmerExportAvecNom() {
    const nomPile = document.getElementById('modal-pile-input').value.trim() || 'Pile sans nom';
    fermerModalPile();

    const date = new Date().toLocaleDateString('fr-FR');
    const dateISO = date.replace(/\//g, '-');
    const datetime = new Date().toLocaleString('fr-FR');
    const filename = `CARSAT_Dons_${dateISO}_${Date.now()}.xls`;
    const { rows, nb } = buildDataRows(equipements);
    const xml = buildWorkbook([{ label: nomPile.substring(0, 31), date, nb, rows }]);
    telechargerXML(xml, filename);
    historique.unshift({ nomPile, date, datetime, filename, nb, dataRows: rows, equipements: JSON.parse(JSON.stringify(equipements)) });
    await sauvegarderHistorique();
    showToast('Exporté et sauvegardé !');
  }


  // affichage de l'onglet historique

  function renderHistorique() {
    const container = document.getElementById('historique-container');
    const btnGlobal = document.getElementById('btn-rapport-global');
    const recherche = (document.getElementById('hist-search')?.value || '').trim().toLowerCase();

    btnGlobal.disabled = historique.length === 0;

    if (historique.length === 0) {
      container.innerHTML = `<div class="hist-empty"><div class="icon"></div><p>Aucun export effectué pour l'instant.</p></div>`;
      return;
    }

    // si on a tape quelque chose dans la barre de recherche, on filtre par nom de pile
    const indexesFiltres = [];
    historique.forEach((h, i) => {
      const nom = (h.nomPile || 'Pile sans nom').toLowerCase();
      if (!recherche || nom.includes(recherche)) indexesFiltres.push(i);
    });

    if (indexesFiltres.length === 0) {
      container.innerHTML = `<div class="hist-empty"><div class="icon"></div><p>Aucune pile ne correspond à "${recherche}".</p></div>`;
      return;
    }

    let html = '';
    indexesFiltres.forEach(i => {
      const h = historique[i];
      const nomPile = h.nomPile || 'Pile sans nom';
      html += `<div class="hist-item">
        <div class="hist-icon"></div>
        <div class="hist-info">
          <div class="hist-pile-nom">${nomPile}</div>
          <div class="hist-meta">Exporté le ${h.datetime} · ${h.nb} équipement(s)</div>
          <div class="hist-filename">${h.filename}</div>
        </div>
        <div class="hist-actions">
          <button class="btn-renommer" onclick="ouvrirModalRenommer(${i})">Renommer</button>
          <button class="btn-retelecharger" onclick="retelecharger(${i})">Retélécharger</button>
          <button class="btn-suppr-hist" onclick="supprimerHistorique(${i})">×</button>
        </div>
      </div>`;
    });
    container.innerHTML = html;
  }

  function retelecharger(index) {
    const h = historique[index];
    const nomPile = h.nomPile || 'Pile sans nom';
    const xml = buildWorkbook([{ label: nomPile.substring(0, 31), date: h.date, nb: h.nb, rows: h.dataRows }]);
    telechargerXML(xml, h.filename);
    showToast('Fichier retéléchargé !');
  }

  async function supprimerHistorique(index) {
    historique.splice(index, 1);
    await sauvegarderHistorique();
    renderHistorique();
    showToast('Export supprimé.');
  }

  // permet de renommer une pile apres coup si besoin

  let indexARenommer = null;

  function ouvrirModalRenommer(index) {
    indexARenommer = index;
    document.getElementById('modal-renommer-input').value = historique[index].nomPile || 'Pile sans nom';
    document.getElementById('modal-renommer-overlay').classList.add('show');
    document.getElementById('modal-renommer-input').focus();
    document.getElementById('modal-renommer-input').select();
  }

  function fermerModalRenommer() {
    document.getElementById('modal-renommer-overlay').classList.remove('show');
    indexARenommer = null;
  }

  async function confirmerRenommer() {
    if (indexARenommer === null) return;
    const nouveauNom = document.getElementById('modal-renommer-input').value.trim() || 'Pile sans nom';
    historique[indexARenommer].nomPile = nouveauNom;
    fermerModalRenommer();
    await sauvegarderHistorique();
    renderHistorique();
    showToast('Pile renommée !');
  }

  // construit le rapport global : toutes les piles les unes apres les autres
  // dans le meme tableau, avec une ligne de separation entre chaque pile
  function buildDataRowsGlobal(historiqueOrdonne) {
    const ordre = ['PC Portable', 'Tour', 'Écran', 'Clavier', 'Souris'];
    let rows = '';
    let totalGeneral = 0;
    let compteurLigne = 0;

    historiqueOrdonne.forEach(h => {
      const nomPile = h.nomPile || h.date || 'Pile';
      const equipementsPile = h.equipements || [];

      // ligne de separation avec le nom de la pile
      rows += `<Row ss:Height="24">
        <Cell ss:MergeAcross="8" ss:StyleID="sGroupe"><Data ss:Type="String">${esc(nomPile)} (${esc(h.datetime || h.date || '')}, ${equipementsPile.reduce((s,e)=>s+(e.qty||1),0)} équipement(s))</Data></Cell>
      </Row>`;

      // meme logique que pour un export classique : on deplie les quantites et on trie par type
      let expanded = [];
      equipementsPile.forEach(e => { for (let q = 0; q < (e.qty||1); q++) expanded.push(e); });
      const sorted = expanded.sort((a, b) => ordre.indexOf(a.type) - ordre.indexOf(b.type));

      sorted.forEach((e) => {
        const styleType = 'sType' + e.type.replace(/\s/g,'').replace('É','E').replace('é','e');
        const styleData = compteurLigne % 2 === 0 ? 'sDataA' : 'sDataB';
        compteurLigne++;
        rows += `<Row ss:Height="18">
          <Cell ss:StyleID="${styleType}"><Data ss:Type="String">${esc(e.type)}</Data></Cell>
          <Cell ss:StyleID="${styleData}"><Data ss:Type="String">${esc(e.modele)}</Data></Cell>
          <Cell ss:StyleID="${styleData}"><Data ss:Type="String">${esc(e.ref)}</Data></Cell>
          <Cell ss:StyleID="${styleData}"><Data ss:Type="String">${esc(e.sn)}</Data></Cell>
          <Cell ss:StyleID="${styleData}"><Data ss:Type="String">${esc(e.formate)}</Data></Cell>
          <Cell ss:StyleID="${styleData}"><Data ss:Type="String">${esc(e.etat)}</Data></Cell>
          <Cell ss:StyleID="${styleData}"><Data ss:Type="String">${esc(e.ram)}</Data></Cell>
          <Cell ss:StyleID="${styleData}"><Data ss:Type="String">${esc(e.disque)}</Data></Cell>
          <Cell ss:StyleID="${styleData}"><Data ss:Type="String">${esc(e.commentaire||'')}</Data></Cell>
        </Row>`;
        totalGeneral++;
      });
    });

    return { rows, totalGeneral };
  }

  function exportRapportGlobal() {
    if (historique.length === 0) return;

    // on remet les piles du plus ancien au plus recent
    const historiqueOrdonne = [...historique].reverse();
    const { rows, totalGeneral } = buildDataRowsGlobal(historiqueOrdonne);

    const today = new Date().toLocaleDateString('fr-FR');
    const xml = buildWorkbook([{
      label: 'Rapport Global',
      date: today,
      nb: totalGeneral,
      rows
    }]);

    const todayISO = today.replace(/\//g, '-');
    telechargerXML(xml, `CARSAT_Rapport_Global_${todayISO}.xls`);
    showToast('Rapport global exporté !');
  }


  // petit message de confirmation en bas de l'ecran

  function showToast(msg, error = false) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.background = error ? '#c0392b' : '#2d7a4f';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }


  // export et import du fichier de sauvegarde json

  function exporterDonneesJSON() {
    const payload = { historique, equipements, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const today = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
    a.href = url;
    a.download = `CARSAT_Sauvegarde_${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Sauvegarde exportée !');
  }

  // importe un ou plusieurs json et ajoute les piles a l'historique actuel
  // (au lieu de tout remplacer). les doublons (meme nom de fichier) sont ignores
  async function importerDonneesJSON(input) {
    const files = Array.from(input.files || []);
    if (files.length === 0) return;

    // liste des fichiers deja presents dans l'historique pour reperer les doublons
    const filenamesExistants = new Set(historique.map(h => h.filename));

    let totalAjoutees = 0;
    let totalIgnorees = 0;
    let fichiersInvalides = 0;

    for (const file of files) {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!data.historique || !Array.isArray(data.historique)) throw new Error('Fichier invalide');

        data.historique.forEach(pile => {
          // si la pile n'a pas de nom de fichier, on la considere comme nouvelle
          if (pile.filename && filenamesExistants.has(pile.filename)) {
            totalIgnorees++;
          } else {
            historique.push(pile);
            if (pile.filename) filenamesExistants.add(pile.filename);
            totalAjoutees++;
          }
        });
      } catch (e) {
        fichiersInvalides++;
      }
    }

    // on remet les exports les plus recents en premier dans la liste
    historique.sort((a, b) => new Date(b.datetime || 0) - new Date(a.datetime || 0));

    await sauvegarderHistorique();
    renderHistorique();

    if (fichiersInvalides > 0 && totalAjoutees === 0) {
      showToast('Aucun fichier JSON valide', true);
    } else {
      let msg = `${totalAjoutees} pile(s) importée(s)`;
      if (totalIgnorees > 0) msg += `, ${totalIgnorees} doublon(s) ignoré(s)`;
      if (fichiersInvalides > 0) msg += `, ${fichiersInvalides} fichier(s) invalide(s)`;
      showToast(msg);
    }

    input.value = '';
  }


  // navigation au clavier avec la touche entree
  // ca permet de passer d'un champ a l'autre, et d'ajouter l'equipement
  // automatiquement une fois arrive au dernier champ

  // ordre des champs selon le type d'equipement
  const champsPCPortable = ['modele', 'modele-autre', 'ref', 'sn', 'formate', 'etat'];
  const champsToure      = ['modele-tour', 'modele-tour-autre', 'ref-tour', 'sn-tour', 'formate-tour', 'etat-tour'];
  const champsEcran      = ['modele-ecran', 'modele-ecran-autre', 'ref-ecran', 'etat-ecran'];
  const champsPeriph     = ['modele-periph', 'qty-periph', 'etat-periph'];

  function getChampsActifs() {
    const type = document.getElementById('type').value;
    if (type === 'PC Portable') return champsPCPortable;
    if (type === 'Tour')        return champsToure;
    if (type === 'Écran')       return champsEcran;
    if (type === 'Clavier' || type === 'Souris') return champsPeriph;
    return [];
  }

  // ne garde que les champs visibles a l'ecran (ex: on cache "modele-autre" si pas utilise)
  function getChampsVisibles() {
    return getChampsActifs().filter(id => {
      const el = document.getElementById(id);
      return el && el.style.display !== 'none';
    });
  }

  function gererEntree(e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();

    const champs = getChampsVisibles();
    const idActuel = e.target.id;
    const indexActuel = champs.indexOf(idActuel);

    if (indexActuel === -1) return;

    // s'il reste un champ apres, on passe au suivant
    if (indexActuel < champs.length - 1) {
      const prochainId = champs[indexActuel + 1];
      const prochainEl = document.getElementById(prochainId);
      if (prochainEl) prochainEl.focus();
    } else {
      // dernier champ atteint : on ajoute l'equipement direct
      ajouterEquipement();
    }
  }

  // on ecoute la touche entree sur tous les champs concernes
  function attacherEntree() {
    const tousLesChamps = [...champsPCPortable, ...champsToure, ...champsEcran, ...champsPeriph];
    tousLesChamps.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('keydown', gererEntree);
    });
  }

  attacherEntree();

  // appuyer sur entree dans les popups de nom de pile valide directement
  document.getElementById('modal-pile-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); confirmerExportAvecNom(); }
    if (e.key === 'Escape') { fermerModalPile(); }
  });
  document.getElementById('modal-renommer-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); confirmerRenommer(); }
    if (e.key === 'Escape') { fermerModalRenommer(); }
  });


  // au chargement de la page, on recupere l'historique en ligne
  chargerHistorique();
