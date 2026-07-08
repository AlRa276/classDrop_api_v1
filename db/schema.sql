CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE rol_usuario             AS ENUM ('estudiante', 'admin');
CREATE TYPE estado_archivo          AS ENUM ('pendiente', 'escaneando', 'revision_calidad', 'publicado', 'rechazado', 'oculto_dislikes');
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
    activo          BOOLEAN      NOT NULL DEFAULT TRUE,
    fmc_token       TEXT,
    two_factor_secret   VARCHAR(6),
    is_two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    remember_token TEXT NULL,
    token_recuperacion VARCHAR(6) NULL,
    token_recuperacion_expira TIMESTAMP NULL


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
    riesgo_ia      SMALLINT       CHECK (riesgo_ia BETWEEN 0 AND 100),
    resultado_ia   JSONB,                         -- desglose completo del veredicto del microservicio
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
    eliminado  BOOLEAN     NOT NULL DEFAULT FALSE,
    oculto BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE likes_comentarios (
    usuario_id    UUID        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    comentario_id UUID        NOT NULL REFERENCES comentarios(id) ON DELETE CASCADE,
    creado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (usuario_id, comentario_id)
);

CREATE TABLE dislikes_comentarios (
    usuario_id    UUID        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    comentario_id UUID        NOT NULL REFERENCES comentarios(id) ON DELETE CASCADE,
    creado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (usuario_id, comentario_id)
);


CREATE TABLE reportes (
    id             UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    reportado_por  UUID                     REFERENCES usuarios(id) ON DELETE CASCADE,
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
 
CREATE TABLE IF NOT EXISTS notificaciones (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id  UUID         NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo      VARCHAR(150) NOT NULL,
    cuerpo      TEXT         NOT NULL,
    tipo        VARCHAR(30)  NOT NULL DEFAULT 'info',
    archivo_id  UUID         REFERENCES archivos(id) ON DELETE SET NULL,
    leida       BOOLEAN      NOT NULL DEFAULT FALSE,
    creado_en   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);


-- vistas

-- VISTA 1 — INNER JOIN: archivos publicados con autor y materia (ambas FK
-- son NOT NULL, así que INNER JOIN es correcto). Se usa para ordenar por
-- popularidad en /archivos/publicados.
CREATE VIEW v_archivos_reporte AS
SELECT
    a.id,
    a.titulo,
    a.descripcion,
    a.tipo,
    a.estado,
    a.materia_id,
    a.creado_en,
    u.id     AS autor_id,
    u.nombre_completo AS autor_nombre,
    m.nombre AS materia_nombre
FROM archivos a
INNER JOIN usuarios u ON u.id = a.subido_por
INNER JOIN materias m ON m.id = a.materia_id
WHERE a.estado = 'publicado';

-- VISTA 2 — LEFT JOIN: todas las materias con su conteo de archivos
-- publicados, incluyendo materias sin ningún archivo todavía.
CREATE VIEW v_materias_reporte AS
SELECT
    m.id,
    m.nombre,
    m.icono,
    m.cuatrimestre_id,
    m.activo,
    COUNT(a.id) AS total_archivos
FROM materias m
LEFT JOIN archivos a ON a.materia_id = m.id AND a.estado = 'publicado'
WHERE m.activo = TRUE
GROUP BY m.id, m.nombre, m.icono, m.cuatrimestre_id, m.activo;

-- funciones

-- FUNCIÓN 1: puntaje de popularidad de un archivo (likes, dislikes,
-- comentarios y descargas), usado para ordenar por relevancia.
CREATE OR REPLACE FUNCTION fn_popularidad_archivo(p_archivo_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_likes       INTEGER;
    v_dislikes    INTEGER;
    v_comentarios INTEGER;
    v_descargas   INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_likes       FROM likes_archivos      WHERE archivo_id = p_archivo_id;
    SELECT COUNT(*) INTO v_dislikes    FROM dislikes_archivos   WHERE archivo_id = p_archivo_id;
    SELECT COUNT(*) INTO v_comentarios FROM comentarios         WHERE archivo_id = p_archivo_id AND NOT eliminado;
    SELECT COUNT(*) INTO v_descargas   FROM descargas_archivos  WHERE archivo_id = p_archivo_id;

    RETURN (v_likes * 2) - v_dislikes + v_comentarios + v_descargas;
END;
$$ LANGUAGE plpgsql;

-- FUNCIÓN 2: nivel de riesgo de un archivo, promedio de puntuación (1-5)
-- de sus reportes pendientes. Usado en el panel de moderación.
CREATE OR REPLACE FUNCTION fn_nivel_riesgo_archivo(p_archivo_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    v_promedio NUMERIC;
BEGIN
    SELECT AVG(puntuacion) INTO v_promedio
    FROM reportes
    WHERE archivo_id = p_archivo_id
      AND estado = 'pendiente';

    RETURN COALESCE(ROUND(v_promedio, 2), 0);
END;
$$ LANGUAGE plpgsql;

-- procedimientos

-- PROCEDIMIENTO 1: publicar un archivo (cambia estado, marca publicado_en
-- y registra la etapa final de publicación). Lo dispara el admin al aprobar.
CREATE OR REPLACE PROCEDURE sp_publicar_archivo(p_archivo_id UUID)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE archivos
    SET estado = 'publicado',
        publicado_en = NOW()
    WHERE id = p_archivo_id;

    INSERT INTO etapas_publicacion (archivo_id, etapa, orden, completado, progreso, actualizado_en)
    VALUES (p_archivo_id, 'publicacion', 4, TRUE, 100, NOW())
    ON CONFLICT (archivo_id, etapa)
    DO UPDATE SET completado = TRUE, progreso = 100, actualizado_en = NOW();
END;
$$;

-- PROCEDIMIENTO 2: rechazar un archivo (cambia estado, guarda motivo y
-- marca la etapa de revisión). Lo dispara el admin al rechazar.
CREATE OR REPLACE PROCEDURE sp_rechazar_archivo(p_archivo_id UUID, p_motivo TEXT)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE archivos
    SET estado = 'rechazado',
        motivo_rechazo = p_motivo
    WHERE id = p_archivo_id;

    INSERT INTO etapas_publicacion (archivo_id, etapa, orden, completado, progreso, actualizado_en)
    VALUES (p_archivo_id, 'revision_calidad', 3, TRUE, 100, NOW())
    ON CONFLICT (archivo_id, etapa)
    DO UPDATE SET completado = TRUE, progreso = 100, actualizado_en = NOW();
END;
$$;

CREATE INDEX idx_archivos_materia        ON archivos(materia_id);
CREATE INDEX idx_archivos_estado         ON archivos(estado);
CREATE INDEX idx_archivos_subido_por     ON archivos(subido_por);
CREATE INDEX idx_archivos_riesgo_ia      ON archivos(riesgo_ia);
CREATE INDEX idx_adjuntos_archivo        ON archivos_adjuntos(archivo_id);
CREATE INDEX idx_comentarios_archivo     ON comentarios(archivo_id);
CREATE INDEX idx_reportes_estado         ON reportes(estado);
CREATE INDEX idx_materias_cuatrimestre   ON materias(cuatrimestre_id);
CREATE INDEX idx_tokens_revocados_expira_en ON tokens_revocados(expira_en);
CREATE INDEX idx_politicas_categoria ON politicas(categoria);
CREATE INDEX idx_etapas_publicacion_archivo ON etapas_publicacion(archivo_id);
CREATE INDEX idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_usuario_leida ON notificaciones(usuario_id, leida);