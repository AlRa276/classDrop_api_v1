

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE rol_usuario             AS ENUM ('estudiante', 'admin');
CREATE TYPE estado_archivo          AS ENUM ('pendiente', 'escaneando', 'revision_calidad', 'publicado', 'rechazado');
CREATE TYPE tipo_archivo            AS ENUM ('pdf', 'docx', 'url', 'otro');
CREATE TYPE estado_norma            AS ENUM ('activa', 'inactiva');
CREATE TYPE estado_reporte           AS ENUM ('pendiente', 'resuelto', 'descartado');
CREATE TYPE tipo_contenido_reportado AS ENUM ('archivo', 'comentario');
CREATE TYPE categoria_politica       AS ENUM ('privacidad', 'seguridad', 'reglamento_interno', 'terminos_uso', 'general');
CREATE TYPE nombre_etapa_publicacion AS ENUM ('archivo_recibido', 'escaneo_seguridad', 'revision_calidad', 'publicacion');

CREATE TABLE usuarios (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_completo VARCHAR(150) NOT NULL,
    correo          VARCHAR(150) NOT NULL UNIQUE
                        CHECK (correo LIKE '%@ids.upchiapas.edu.mx' OR correo LIKE '%@upchiapas.edu.mx'),
    contrasena_hash TEXT         NOT NULL,
    rol             rol_usuario  NOT NULL DEFAULT 'estudiante',
    avatar_url      TEXT,
    creado_en       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    activo          BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE tokens_revocados (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash  VARCHAR(64)  NOT NULL UNIQUE,
    usuario_id  UUID         NOT NULL REFERENCES usuarios(id),
    expira_en   TIMESTAMPTZ  NOT NULL,
    creado_en   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);


CREATE TABLE cuatrimestres (
    id     SMALLINT    PRIMARY KEY,   -- de 1 a 10
    nombre VARCHAR(30) NOT NULL       
);
 
INSERT INTO cuatrimestres (id, nombre) VALUES
    (1,'Cuatrimestre 1'), (2,'Cuatrimestre 2'),  (3,'Cuatrimestre 3'),
    (4,'Cuatrimestre 4'), (5,'Cuatrimestre 5'),  (6,'Cuatrimestre 6'),
    (7,'Cuatrimestre 7'), (8,'Cuatrimestre 8'),  (9,'Cuatrimestre 9'),
    (10,'Cuatrimestre 10');

CREATE TABLE materias (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          VARCHAR(120) NOT NULL,
    icono           VARCHAR(50),                  
    cuatrimestre_id SMALLINT    NOT NULL REFERENCES cuatrimestres(id),
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    activo          BOOLEAN     NOT NULL DEFAULT TRUE,
    UNIQUE (nombre, cuatrimestre_id)
);


CREATE TABLE normas (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo         VARCHAR(200) NOT NULL,
    descripcion    TEXT         NOT NULL,
    icono          VARCHAR(50),
    estado         estado_norma NOT NULL DEFAULT 'activa',
    creado_en      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE politicas (
    id             UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria      categoria_politica  NOT NULL DEFAULT 'general',
    titulo         VARCHAR(150)        NOT NULL,
    contenido      TEXT                NOT NULL,
    icono          VARCHAR(50),
    es_principal   BOOLEAN             NOT NULL DEFAULT FALSE,
    orden          SMALLINT            NOT NULL DEFAULT 0,
    activo         BOOLEAN             NOT NULL DEFAULT TRUE,
    creado_en      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE TABLE archivos (
    id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
--archivo_id     UUID           UNIQUE REFERENCES archivos_adjuntos(id) ON DELETE SET NULL,  
    titulo         VARCHAR(200)   NOT NULL,
    descripcion    TEXT,
    tipo           tipo_archivo   NOT NULL DEFAULT 'pdf',
    estado         estado_archivo NOT NULL DEFAULT 'pendiente',
    motivo_rechazo TEXT,                          -- razón del flag de IA o rechazo manual
    subido_por     UUID           NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    materia_id     UUID           NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
    publicado_en   TIMESTAMPTZ,
    creado_en      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);



CREATE TABLE archivos_adjuntos (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    archivo_id      UUID         NOT NULL REFERENCES archivos(id) ON DELETE CASCADE,
    url_storage     TEXT         NOT NULL,         
    nombre_original VARCHAR(255),                  
    tipo_mime       VARCHAR(100),                  
    tamano_bytes    BIGINT,                       
    num_paginas     SMALLINT,                      
    orden           SMALLINT     NOT NULL DEFAULT 0, 
    creado_en       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE likes_archivos (
    usuario_id UUID        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    archivo_id UUID        NOT NULL REFERENCES archivos(id) ON DELETE CASCADE,
    creado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (usuario_id, archivo_id)
);
--nuevo
CREATE TABLE dislikes_archivos (
    usuario_id UUID        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    archivo_id UUID        NOT NULL REFERENCES archivos(id) ON DELETE CASCADE,
    creado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (usuario_id, archivo_id)
);

CREATE TABLE descargas_archivos (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id    UUID        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    archivo_id    UUID        NOT NULL REFERENCES archivos(id) ON DELETE CASCADE,
    adjunto_id    UUID        REFERENCES archivos_adjuntos(id) ON DELETE SET NULL, 
    descargado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE guardados_archivos (
    usuario_id UUID        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    archivo_id UUID        NOT NULL REFERENCES archivos(id) ON DELETE CASCADE,
    creado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (usuario_id, archivo_id)
);

CREATE TABLE comentarios (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    contenido  TEXT        NOT NULL,
    archivo_id UUID        NOT NULL REFERENCES archivos(id) ON DELETE CASCADE,
    usuario_id UUID        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    creado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    eliminado  BOOLEAN     NOT NULL DEFAULT FALSE
);

CREATE TABLE likes_comentarios (
    usuario_id    UUID        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    comentario_id UUID        NOT NULL REFERENCES comentarios(id) ON DELETE CASCADE,
    creado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (usuario_id, comentario_id)
);

CREATE TABLE IF NOT EXISTS dislikes_comentarios (
    usuario_id    UUID        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    comentario_id UUID        NOT NULL REFERENCES comentarios(id) ON DELETE CASCADE,
    creado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (usuario_id, comentario_id)
);


CREATE TABLE reportes (
    id             UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    reportado_por  UUID                     NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo_contenido tipo_contenido_reportado NOT NULL,
    archivo_id     UUID                     REFERENCES archivos(id)    ON DELETE CASCADE,
    comentario_id  UUID                     REFERENCES comentarios(id) ON DELETE CASCADE,
    puntuacion     SMALLINT                 CHECK (puntuacion BETWEEN 1 AND 5),
    estado         estado_reporte           NOT NULL DEFAULT 'pendiente',
    resuelto_por   UUID                     REFERENCES usuarios(id),
    accion_tomada  TEXT,                  
    creado_en      TIMESTAMPTZ              NOT NULL DEFAULT NOW(),
    resuelto_en    TIMESTAMPTZ,
    CONSTRAINT chk_reporte_target CHECK (
        (archivo_id IS NOT NULL AND comentario_id IS NULL) OR
        (archivo_id IS NULL     AND comentario_id IS NOT NULL)
    )
);

CREATE TABLE moderaciones_ia (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    archivo_id   UUID        NOT NULL REFERENCES archivos(id) ON DELETE CASCADE,
    motivo_flag  TEXT,
    aprobado     BOOLEAN,
    revisado_por UUID        REFERENCES usuarios(id),   -- admin que tomó la decisión final
    creado_en    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

 
CREATE TABLE etapas_publicacion (
    id             UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    archivo_id     UUID                     NOT NULL REFERENCES archivos(id) ON DELETE CASCADE,
    etapa          nombre_etapa_publicacion NOT NULL,
    orden          SMALLINT                 NOT NULL,   -- 1 Archivo Recibido, 2 Escaneo, 3 Revisión, 4 Publicación
    completado     BOOLEAN                  NOT NULL DEFAULT FALSE,
    progreso       SMALLINT,                             -- 0-100 para etapas en curso (ej. escaneo 45 %)
    actualizado_en TIMESTAMPTZ              NOT NULL DEFAULT NOW(),
    UNIQUE (archivo_id, etapa)
);
 


-- vistas

 
-- Estadísticas por si acaso
CREATE VIEW v_estadisticas_archivos AS
SELECT
    a.id,
    a.titulo,
    a.materia_id,
    COUNT(DISTINCT la.usuario_id)  AS total_likes,
    COUNT(DISTINCT dla.usuario_id) AS total_dislikes,
    COUNT(DISTINCT da.id)          AS total_descargas,
    COUNT(DISTINCT c.id)           AS total_comentarios,
    COUNT(DISTINCT adj.id)         AS total_adjuntos
FROM archivos a
LEFT JOIN likes_archivos      la  ON la.archivo_id  = a.id
LEFT JOIN dislikes_archivos   dla ON dla.archivo_id = a.id
LEFT JOIN descargas_archivos  da  ON da.archivo_id  = a.id
LEFT JOIN comentarios         c   ON c.archivo_id   = a.id AND NOT c.eliminado
LEFT JOIN archivos_adjuntos   adj ON adj.archivo_id = a.id
WHERE a.estado = 'publicado'
GROUP BY a.id, a.titulo, a.materia_id;
 
-- Total de archivos publicados por materia
CREATE VIEW v_archivos_por_materia AS
SELECT
    m.id,
    m.nombre,
    m.cuatrimestre_id,
    COUNT(a.id) AS total_archivos
FROM materias m
LEFT JOIN archivos a ON a.materia_id = m.id AND a.estado = 'publicado'
GROUP BY m.id, m.nombre, m.cuatrimestre_id;

CREATE INDEX idx_archivos_materia        ON archivos(materia_id);
CREATE INDEX idx_archivos_estado         ON archivos(estado);
CREATE INDEX idx_archivos_subido_por     ON archivos(subido_por);
CREATE INDEX idx_adjuntos_archivo        ON archivos_adjuntos(archivo_id);
CREATE INDEX idx_comentarios_archivo     ON comentarios(archivo_id);
CREATE INDEX idx_reportes_estado         ON reportes(estado);
CREATE INDEX idx_materias_cuatrimestre   ON materias(cuatrimestre_id);
CREATE INDEX idx_tokens_revocados_expira_en ON tokens_revocados(expira_en);
CREATE INDEX idx_politicas_categoria ON politicas(categoria);
CREATE INDEX idx_etapas_publicacion_archivo ON etapas_publicacion(archivo_id);
 